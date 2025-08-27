-- Triggers for automated business logic

-- Trigger to auto-generate member ID
CREATE OR REPLACE FUNCTION trigger_generate_member_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.member_id IS NULL OR NEW.member_id = '' THEN
        NEW.member_id := generate_member_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_members_generate_id
    BEFORE INSERT ON members
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_member_id();

-- Trigger to auto-generate donation ID
CREATE OR REPLACE FUNCTION trigger_generate_donation_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.donation_id IS NULL OR NEW.donation_id = '' THEN
        NEW.donation_id := generate_donation_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_donations_generate_id
    BEFORE INSERT ON donations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_donation_id();

-- Trigger to auto-generate registration ID
CREATE OR REPLACE FUNCTION trigger_generate_registration_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.registration_id IS NULL OR NEW.registration_id = '' THEN
        NEW.registration_id := generate_registration_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_registrations_generate_id
    BEFORE INSERT ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_registration_id();

-- Trigger to auto-generate certificate ID and verification code
CREATE OR REPLACE FUNCTION trigger_generate_certificate_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.certificate_id IS NULL OR NEW.certificate_id = '' THEN
        NEW.certificate_id := generate_certificate_id();
    END IF;
    
    IF NEW.verification_code IS NULL OR NEW.verification_code = '' THEN
        NEW.verification_code := generate_verification_code();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_certificates_generate_data
    BEFORE INSERT ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_certificate_data();

-- Trigger to calculate membership expiry date
CREATE OR REPLACE FUNCTION trigger_calculate_membership_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expiry_date IS NULL AND NEW.join_date IS NOT NULL THEN
        NEW.expiry_date := calculate_membership_expiry(NEW.membership_type, NEW.join_date);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_members_calculate_expiry
    BEFORE INSERT OR UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION trigger_calculate_membership_expiry();

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp trigger to all relevant tables
CREATE TRIGGER trigger_members_update_timestamp
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER trigger_events_update_timestamp
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER trigger_event_registrations_update_timestamp
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER trigger_donations_update_timestamp
    BEFORE UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER trigger_blogs_update_timestamp
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER trigger_library_update_timestamp
    BEFORE UPDATE ON library
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER trigger_projects_update_timestamp
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER trigger_payments_update_timestamp
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER trigger_certificates_update_timestamp
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER trigger_admin_users_update_timestamp
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER trigger_settings_update_timestamp
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_timestamp();

-- Trigger to update project raised amount when donation changes
CREATE OR REPLACE FUNCTION trigger_update_project_donation()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT and UPDATE
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.project_id IS NOT NULL THEN
            PERFORM update_project_raised_amount(NEW.project_id);
        END IF;
        
        -- If project_id changed in UPDATE, update old project too
        IF TG_OP = 'UPDATE' AND OLD.project_id IS NOT NULL AND OLD.project_id != NEW.project_id THEN
            PERFORM update_project_raised_amount(OLD.project_id);
        END IF;
        
        RETURN NEW;
    END IF;
    
    -- Handle DELETE
    IF TG_OP = 'DELETE' THEN
        IF OLD.project_id IS NOT NULL THEN
            PERFORM update_project_raised_amount(OLD.project_id);
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_donations_update_project
    AFTER INSERT OR UPDATE OR DELETE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_project_donation();

-- Audit logging trigger
CREATE OR REPLACE FUNCTION trigger_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB;
    new_data JSONB;
    changed_by_id UUID;
BEGIN
    -- Get the user ID from the current session (if available)
    BEGIN
        changed_by_id := current_setting('app.current_user_id')::UUID;
    EXCEPTION
        WHEN OTHERS THEN
            changed_by_id := NULL;
    END;
    
    IF TG_OP = 'DELETE' THEN
        old_data := to_jsonb(OLD);
        new_data := NULL;
        
        INSERT INTO audit_logs (
            table_name,
            record_id,
            action,
            old_values,
            new_values,
            changed_by
        ) VALUES (
            TG_TABLE_NAME,
            OLD.id,
            TG_OP,
            old_data,
            new_data,
            changed_by_id
        );
        
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        old_data := to_jsonb(OLD);
        new_data := to_jsonb(NEW);
        
        INSERT INTO audit_logs (
            table_name,
            record_id,
            action,
            old_values,
            new_values,
            changed_by
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            TG_OP,
            old_data,
            new_data,
            changed_by_id
        );
        
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        old_data := NULL;
        new_data := to_jsonb(NEW);
        
        INSERT INTO audit_logs (
            table_name,
            record_id,
            action,
            old_values,
            new_values,
            changed_by
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            TG_OP,
            old_data,
            new_data,
            changed_by_id
        );
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit logging to sensitive tables
CREATE TRIGGER trigger_members_audit
    AFTER INSERT OR UPDATE OR DELETE ON members
    FOR EACH ROW
    EXECUTE FUNCTION trigger_audit_log();

CREATE TRIGGER trigger_donations_audit
    AFTER INSERT OR UPDATE OR DELETE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_audit_log();

CREATE TRIGGER trigger_payments_audit
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_audit_log();

CREATE TRIGGER trigger_admin_users_audit
    AFTER INSERT OR UPDATE OR DELETE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_audit_log();

-- Trigger to create approval record for new memberships
CREATE OR REPLACE FUNCTION trigger_create_membership_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.membership_status = 'pending' THEN
        INSERT INTO approvals (
            reference_type,
            reference_id,
            status,
            requested_by,
            notes
        ) VALUES (
            'membership',
            NEW.id,
            'pending',
            NULL,
            'New membership application for ' || NEW.full_name
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_members_create_approval
    AFTER INSERT ON members
    FOR EACH ROW
    EXECUTE FUNCTION trigger_create_membership_approval();

-- Trigger to auto-approve based on settings
CREATE OR REPLACE FUNCTION trigger_auto_approve()
RETURNS TRIGGER AS $$
DECLARE
    auto_approve_setting TEXT;
BEGIN
    -- Check if auto-approval is enabled
    SELECT value INTO auto_approve_setting
    FROM settings
    WHERE key = 'auto_approve_memberships';
    
    IF auto_approve_setting = 'true' AND NEW.payment_status = 'completed' THEN
        NEW.membership_status := 'active';
        
        -- Update approval record
        UPDATE approvals
        SET 
            status = 'approved',
            processed_at = NOW(),
            notes = 'Auto-approved after payment completion'
        WHERE reference_type = 'membership'
        AND reference_id = NEW.id
        AND status = 'pending';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_members_auto_approve
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION trigger_auto_approve();
