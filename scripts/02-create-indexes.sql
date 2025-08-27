-- Performance indexes for frequently queried columns

-- Members table indexes
CREATE INDEX idx_members_member_id ON members(member_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_phone ON members(phone);
CREATE INDEX idx_members_membership_type ON members(membership_type);
CREATE INDEX idx_members_membership_status ON members(membership_status);
CREATE INDEX idx_members_payment_status ON members(payment_status);
CREATE INDEX idx_members_join_date ON members(join_date);
CREATE INDEX idx_members_expiry_date ON members(expiry_date);
CREATE INDEX idx_members_created_at ON members(created_at);
CREATE INDEX idx_members_referred_by ON members(referred_by);

-- Events table indexes
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_is_featured ON events(is_featured);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_city ON events(city);
CREATE INDEX idx_events_tags ON events USING GIN(tags);
CREATE INDEX idx_events_registration_deadline ON events(registration_deadline);

-- Event registrations indexes
CREATE INDEX idx_event_registrations_registration_id ON event_registrations(registration_id);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_participant_email ON event_registrations(participant_email);
CREATE INDEX idx_event_registrations_payment_status ON event_registrations(payment_status);
CREATE INDEX idx_event_registrations_registration_status ON event_registrations(registration_status);
CREATE INDEX idx_event_registrations_registration_date ON event_registrations(registration_date);

-- Donations table indexes
CREATE INDEX idx_donations_donation_id ON donations(donation_id);
CREATE INDEX idx_donations_donor_email ON donations(donor_email);
CREATE INDEX idx_donations_amount ON donations(amount);
CREATE INDEX idx_donations_donation_type ON donations(donation_type);
CREATE INDEX idx_donations_payment_status ON donations(payment_status);
CREATE INDEX idx_donations_payment_gateway ON donations(payment_gateway);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_donations_project_id ON donations(project_id);
CREATE INDEX idx_donations_event_id ON donations(event_id);
CREATE INDEX idx_donations_member_id ON donations(member_id);
CREATE INDEX idx_donations_is_recurring ON donations(is_recurring);

-- Blogs table indexes
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_is_featured ON blogs(is_featured);
CREATE INDEX idx_blogs_published_at ON blogs(published_at);
CREATE INDEX idx_blogs_category ON blogs(category);
CREATE INDEX idx_blogs_tags ON blogs USING GIN(tags);
CREATE INDEX idx_blogs_created_by ON blogs(created_by);
CREATE INDEX idx_blogs_view_count ON blogs(view_count);

-- Library table indexes
CREATE INDEX idx_library_slug ON library(slug);
CREATE INDEX idx_library_status ON library(status);
CREATE INDEX idx_library_category ON library(category);
CREATE INDEX idx_library_language ON library(language);
CREATE INDEX idx_library_tags ON library USING GIN(tags);
CREATE INDEX idx_library_is_premium ON library(is_premium);
CREATE INDEX idx_library_download_count ON library(download_count);
CREATE INDEX idx_library_created_by ON library(created_by);

-- Projects table indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_end_date ON projects(end_date);
CREATE INDEX idx_projects_created_by ON projects(created_by);

-- Payments table indexes
CREATE INDEX idx_payments_payment_id ON payments(payment_id);
CREATE INDEX idx_payments_reference_type ON payments(reference_type);
CREATE INDEX idx_payments_reference_id ON payments(reference_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_gateway ON payments(payment_gateway);
CREATE INDEX idx_payments_customer_email ON payments(customer_email);
CREATE INDEX idx_payments_initiated_at ON payments(initiated_at);
CREATE INDEX idx_payments_completed_at ON payments(completed_at);
CREATE INDEX idx_payments_gateway_transaction_id ON payments(gateway_transaction_id);

-- Certificates table indexes
CREATE INDEX idx_certificates_certificate_id ON certificates(certificate_id);
CREATE INDEX idx_certificates_certificate_type ON certificates(certificate_type);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX idx_certificates_member_id ON certificates(member_id);
CREATE INDEX idx_certificates_event_id ON certificates(event_id);
CREATE INDEX idx_certificates_donation_id ON certificates(donation_id);
CREATE INDEX idx_certificates_issue_date ON certificates(issue_date);
CREATE INDEX idx_certificates_is_active ON certificates(is_active);

-- Admin users indexes
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX idx_admin_users_last_login ON admin_users(last_login);

-- FAQs indexes
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_is_active ON faqs(is_active);
CREATE INDEX idx_faqs_sort_order ON faqs(sort_order);

-- Global presence indexes
CREATE INDEX idx_global_presence_country ON global_presence(country);
CREATE INDEX idx_global_presence_city ON global_presence(city);
CREATE INDEX idx_global_presence_is_active ON global_presence(is_active);

-- Team members indexes
CREATE INDEX idx_team_members_position ON team_members(position);
CREATE INDEX idx_team_members_is_active ON team_members(is_active);
CREATE INDEX idx_team_members_sort_order ON team_members(sort_order);

-- Policies indexes
CREATE INDEX idx_policies_slug ON policies(slug);
CREATE INDEX idx_policies_type ON policies(type);
CREATE INDEX idx_policies_is_active ON policies(is_active);
CREATE INDEX idx_policies_effective_date ON policies(effective_date);

-- Official documents indexes
CREATE INDEX idx_official_documents_document_type ON official_documents(document_type);
CREATE INDEX idx_official_documents_is_public ON official_documents(is_public);
CREATE INDEX idx_official_documents_issue_date ON official_documents(issue_date);
CREATE INDEX idx_official_documents_expiry_date ON official_documents(expiry_date);

-- Email logs indexes
CREATE INDEX idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_template_used ON email_logs(template_used);
CREATE INDEX idx_email_logs_reference_type ON email_logs(reference_type);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at);

-- File uploads indexes
CREATE INDEX idx_file_uploads_file_type ON file_uploads(file_type);
CREATE INDEX idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
CREATE INDEX idx_file_uploads_reference_type ON file_uploads(reference_type);
CREATE INDEX idx_file_uploads_reference_id ON file_uploads(reference_id);
CREATE INDEX idx_file_uploads_is_public ON file_uploads(is_public);
CREATE INDEX idx_file_uploads_created_at ON file_uploads(created_at);

-- Settings indexes
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);
CREATE INDEX idx_settings_is_public ON settings(is_public);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_changed_by ON audit_logs(changed_by);
CREATE INDEX idx_audit_logs_changed_at ON audit_logs(changed_at);

-- Approvals indexes
CREATE INDEX idx_approvals_reference_type ON approvals(reference_type);
CREATE INDEX idx_approvals_reference_id ON approvals(reference_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_approved_by ON approvals(approved_by);
CREATE INDEX idx_approvals_requested_at ON approvals(requested_at);
CREATE INDEX idx_approvals_processed_at ON approvals(processed_at);

-- Verification requests indexes
CREATE INDEX idx_verification_requests_verification_type ON verification_requests(verification_type);
CREATE INDEX idx_verification_requests_verification_code ON verification_requests(verification_code);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);
CREATE INDEX idx_verification_requests_verified_by ON verification_requests(verified_by);
CREATE INDEX idx_verification_requests_created_at ON verification_requests(created_at);

-- Composite indexes for common query patterns
CREATE INDEX idx_members_status_type ON members(membership_status, membership_type);
CREATE INDEX idx_events_date_status ON events(event_date, status);
CREATE INDEX idx_donations_date_status ON donations(created_at, payment_status);
CREATE INDEX idx_payments_reference ON payments(reference_type, reference_id);
CREATE INDEX idx_blogs_published_featured ON blogs(published_at, is_featured) WHERE status = 'published';
CREATE INDEX idx_events_upcoming ON events(event_date, status) WHERE event_date >= CURRENT_DATE;

-- Full-text search indexes
CREATE INDEX idx_members_search ON members USING GIN(to_tsvector('english', full_name || ' ' || COALESCE(email, '')));
CREATE INDEX idx_events_search ON events USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_blogs_search ON blogs USING GIN(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, '')));
CREATE INDEX idx_library_search ON library USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(author, '')));
