-- Custom functions for business logic and automation

-- Function to generate member ID
CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TEXT AS $$
DECLARE
    current_year TEXT;
    next_number INTEGER;
    member_id TEXT;
BEGIN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    -- Get the next number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(member_id FROM 6) AS INTEGER)), 0) + 1
    INTO next_number
    FROM members
    WHERE member_id LIKE 'M' || current_year || '%';
    
    -- Format: M2024001, M2024002, etc.
    member_id := 'M' || current_year || LPAD(next_number::TEXT, 3, '0');
    
    RETURN member_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate donation ID
CREATE OR REPLACE FUNCTION generate_donation_id()
RETURNS TEXT AS $$
DECLARE
    current_year TEXT;
    next_number INTEGER;
    donation_id TEXT;
BEGIN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(donation_id FROM 6) AS INTEGER)), 0) + 1
    INTO next_number
    FROM donations
    WHERE donation_id LIKE 'D' || current_year || '%';
    
    donation_id := 'D' || current_year || LPAD(next_number::TEXT, 3, '0');
    
    RETURN donation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate event registration ID
CREATE OR REPLACE FUNCTION generate_registration_id()
RETURNS TEXT AS $$
DECLARE
    current_year TEXT;
    next_number INTEGER;
    registration_id TEXT;
BEGIN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(registration_id FROM 6) AS INTEGER)), 0) + 1
    INTO next_number
    FROM event_registrations
    WHERE registration_id LIKE 'R' || current_year || '%';
    
    registration_id := 'R' || current_year || LPAD(next_number::TEXT, 3, '0');
    
    RETURN registration_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate certificate ID
CREATE OR REPLACE FUNCTION generate_certificate_id()
RETURNS TEXT AS $$
DECLARE
    current_year TEXT;
    next_number INTEGER;
    certificate_id TEXT;
BEGIN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(certificate_id FROM 6) AS INTEGER)), 0) + 1
    INTO next_number
    FROM certificates
    WHERE certificate_id LIKE 'C' || current_year || '%';
    
    certificate_id := 'C' || current_year || LPAD(next_number::TEXT, 3, '0');
    
    RETURN certificate_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
BEGIN
    RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 12));
END;
$$ LANGUAGE plpgsql;

-- Function to calculate membership expiry date
CREATE OR REPLACE FUNCTION calculate_membership_expiry(membership_type membership_type, join_date DATE)
RETURNS DATE AS $$
BEGIN
    CASE membership_type
        WHEN 'basic' THEN
            RETURN join_date + INTERVAL '1 year';
        WHEN 'premium' THEN
            RETURN join_date + INTERVAL '2 years';
        WHEN 'student' THEN
            RETURN join_date + INTERVAL '1 year';
        WHEN 'senior' THEN
            RETURN join_date + INTERVAL '1 year';
        WHEN 'lifetime' THEN
            RETURN NULL; -- Lifetime membership never expires
        ELSE
            RETURN join_date + INTERVAL '1 year';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to update project raised amount
CREATE OR REPLACE FUNCTION update_project_raised_amount(project_uuid UUID)
RETURNS VOID AS $$
DECLARE
    total_raised DECIMAL(12,2);
    total_donors INTEGER;
BEGIN
    SELECT 
        COALESCE(SUM(amount), 0),
        COUNT(DISTINCT donor_email)
    INTO total_raised, total_donors
    FROM donations
    WHERE project_id = project_uuid 
    AND payment_status = 'completed';
    
    UPDATE projects
    SET 
        raised_amount = total_raised,
        progress_percentage = CASE 
            WHEN goal_amount > 0 THEN (total_raised / goal_amount * 100)
            ELSE 0
        END,
        updated_at = NOW()
    WHERE id = project_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to check if member is active
CREATE OR REPLACE FUNCTION is_member_active(member_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    member_record RECORD;
BEGIN
    SELECT membership_status, expiry_date
    INTO member_record
    FROM members
    WHERE id = member_uuid;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if membership is active and not expired
    IF member_record.membership_status = 'active' THEN
        IF member_record.expiry_date IS NULL OR member_record.expiry_date >= CURRENT_DATE THEN
            RETURN TRUE;
        END IF;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to get member statistics
CREATE OR REPLACE FUNCTION get_member_statistics()
RETURNS TABLE(
    total_members BIGINT,
    active_members BIGINT,
    pending_members BIGINT,
    expired_members BIGINT,
    basic_members BIGINT,
    premium_members BIGINT,
    lifetime_members BIGINT,
    student_members BIGINT,
    senior_members BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_members,
        COUNT(*) FILTER (WHERE membership_status = 'active') as active_members,
        COUNT(*) FILTER (WHERE membership_status = 'pending') as pending_members,
        COUNT(*) FILTER (WHERE membership_status = 'expired') as expired_members,
        COUNT(*) FILTER (WHERE membership_type = 'basic') as basic_members,
        COUNT(*) FILTER (WHERE membership_type = 'premium') as premium_members,
        COUNT(*) FILTER (WHERE membership_type = 'lifetime') as lifetime_members,
        COUNT(*) FILTER (WHERE membership_type = 'student') as student_members,
        COUNT(*) FILTER (WHERE membership_type = 'senior') as senior_members
    FROM members;
END;
$$ LANGUAGE plpgsql;

-- Function to get donation statistics
CREATE OR REPLACE FUNCTION get_donation_statistics()
RETURNS TABLE(
    total_donations BIGINT,
    total_amount DECIMAL(12,2),
    completed_donations BIGINT,
    completed_amount DECIMAL(12,2),
    pending_donations BIGINT,
    pending_amount DECIMAL(12,2),
    average_donation DECIMAL(12,2),
    unique_donors BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_donations,
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(*) FILTER (WHERE payment_status = 'completed') as completed_donations,
        COALESCE(SUM(amount) FILTER (WHERE payment_status = 'completed'), 0) as completed_amount,
        COUNT(*) FILTER (WHERE payment_status = 'pending') as pending_donations,
        COALESCE(SUM(amount) FILTER (WHERE payment_status = 'pending'), 0) as pending_amount,
        COALESCE(AVG(amount) FILTER (WHERE payment_status = 'completed'), 0) as average_donation,
        COUNT(DISTINCT donor_email) as unique_donors
    FROM donations;
END;
$$ LANGUAGE plpgsql;

-- Function to get event statistics
CREATE OR REPLACE FUNCTION get_event_statistics()
RETURNS TABLE(
    total_events BIGINT,
    published_events BIGINT,
    upcoming_events BIGINT,
    completed_events BIGINT,
    total_registrations BIGINT,
    confirmed_registrations BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE status = 'published') as published_events,
        COUNT(*) FILTER (WHERE status = 'published' AND event_date >= CURRENT_DATE) as upcoming_events,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_events,
        (SELECT COUNT(*) FROM event_registrations) as total_registrations,
        (SELECT COUNT(*) FROM event_registrations WHERE registration_status = 'confirmed') as confirmed_registrations
    FROM events;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired sessions or temporary data
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS VOID AS $$
BEGIN
    -- Update expired memberships
    UPDATE members
    SET membership_status = 'expired'
    WHERE membership_status = 'active'
    AND expiry_date IS NOT NULL
    AND expiry_date < CURRENT_DATE;
    
    -- Clean up old email logs (older than 1 year)
    DELETE FROM email_logs
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    -- Clean up old audit logs (older than 2 years)
    DELETE FROM audit_logs
    WHERE changed_at < NOW() - INTERVAL '2 years';
    
    -- Clean up old verification requests (older than 30 days)
    DELETE FROM verification_requests
    WHERE created_at < NOW() - INTERVAL '30 days'
    AND status IN ('verified', 'invalid');
END;
$$ LANGUAGE plpgsql;

-- Function to search members
CREATE OR REPLACE FUNCTION search_members(search_term TEXT)
RETURNS TABLE(
    id UUID,
    member_id VARCHAR(20),
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    membership_type membership_type,
    membership_status membership_status,
    join_date DATE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.member_id,
        m.full_name,
        m.email,
        m.phone,
        m.membership_type,
        m.membership_status,
        m.join_date,
        ts_rank(to_tsvector('english', m.full_name || ' ' || COALESCE(m.email, '')), plainto_tsquery('english', search_term)) as rank
    FROM members m
    WHERE to_tsvector('english', m.full_name || ' ' || COALESCE(m.email, '')) @@ plainto_tsquery('english', search_term)
    ORDER BY rank DESC, m.created_at DESC;
END;
$$ LANGUAGE plpgsql;
