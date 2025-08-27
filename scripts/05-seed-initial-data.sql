-- Initial data for the application

-- Insert default admin user
INSERT INTO admin_users (
    username,
    email,
    password_hash,
    full_name,
    role,
    is_active
) VALUES (
    'admin',
    'admin@sanatandharma.org',
    '$2a$12$0Sq/9DbYW37GY.lXy2gOnegG8Brn5AXLNREVEDj0s.dK1UelOb/cS', -- password: admin123
    'System Administrator',
    'admin',
    true
) ON CONFLICT (username) DO NOTHING;

-- Insert application settings
INSERT INTO settings (key, value, type, category, description, is_public) VALUES
('site_name', 'Sanatan Dharma Bikash Nepal', 'string', 'general', 'Website name', true),
('site_description', 'Preserving and promoting Sanatan Dharma values through education and community service', 'string', 'general', 'Website description', true),
('contact_email', 'info@sanatandharma.org', 'string', 'contact', 'Primary contact email', true),
('contact_phone', '+977-1-4444444', 'string', 'contact', 'Primary contact phone', true),
('contact_address', 'Kathmandu, Nepal', 'string', 'contact', 'Primary address', true),
('auto_approve_memberships', 'false', 'boolean', 'membership', 'Auto-approve memberships after payment', false),
('auto_approve_donations', 'true', 'boolean', 'donation', 'Auto-approve donations after payment', false),
('membership_basic_fee', '1000', 'number', 'membership', 'Basic membership fee in NPR', true),
('membership_premium_fee', '2500', 'number', 'membership', 'Premium membership fee in NPR', true),
('membership_lifetime_fee', '10000', 'number', 'membership', 'Lifetime membership fee in NPR', true),
('membership_student_fee', '500', 'number', 'membership', 'Student membership fee in NPR', true),
('membership_senior_fee', '750', 'number', 'membership', 'Senior membership fee in NPR', true),
('currency', 'NPR', 'string', 'general', 'Default currency', true),
('timezone', 'Asia/Kathmandu', 'string', 'general', 'Default timezone', false),
('max_file_size_mb', '50', 'number', 'upload', 'Maximum file upload size in MB', false),
('allowed_file_types', 'image/*,video/*,audio/*,.pdf,.doc,.docx', 'string', 'upload', 'Allowed file types for upload', false),
('email_from_name', 'Sanatan Dharma Bikash Nepal', 'string', 'email', 'Email sender name', false),
('email_from_address', 'noreply@sanatandharma.org', 'string', 'email', 'Email sender address', false),
('social_facebook', 'https://facebook.com/sanatandharma', 'string', 'social', 'Facebook page URL', true),
('social_twitter', 'https://twitter.com/sanatandharma', 'string', 'social', 'Twitter profile URL', true),
('social_instagram', 'https://instagram.com/sanatandharma', 'string', 'social', 'Instagram profile URL', true),
('social_youtube', 'https://youtube.com/sanatandharma', 'string', 'social', 'YouTube channel URL', true),
('maintenance_mode', 'false', 'boolean', 'system', 'Enable maintenance mode', false),
('registration_open', 'true', 'boolean', 'membership', 'Allow new member registrations', true),
('donation_minimum', '100', 'number', 'donation', 'Minimum donation amount in NPR', true),
('donation_maximum', '1000000', 'number', 'donation', 'Maximum donation amount in NPR', true)
ON CONFLICT (key) DO NOTHING;

-- Insert default FAQs
INSERT INTO faqs (question, answer, category, sort_order, is_active) VALUES
('What is Sanatan Dharma Bikash Nepal?', 'Sanatan Dharma Bikash Nepal is a non-profit organization dedicated to preserving and promoting the values, traditions, and teachings of Sanatan Dharma through education, community service, and cultural activities.', 'general', 1, true),
('How can I become a member?', 'You can become a member by filling out our online membership application form and paying the membership fee. We offer different membership types including Basic, Premium, Student, Senior, and Lifetime memberships.', 'membership', 2, true),
('What are the membership benefits?', 'Members enjoy access to all events and workshops, monthly newsletters, library access to Sanskrit texts and resources, community forum participation, special discounts, and a membership certificate.', 'membership', 3, true),
('How can I make a donation?', 'You can make donations through our secure online payment system using eSewa, Khalti, PayPal, Stripe, or other supported payment methods. You can also make bank transfers or visit our office for cash donations.', 'donation', 4, true),
('Are donations tax-deductible?', 'Yes, donations to Sanatan Dharma Bikash Nepal are eligible for tax deduction under applicable Nepali tax laws. You will receive a receipt for your donation that can be used for tax purposes.', 'donation', 5, true),
('How can I register for events?', 'You can register for events through our website by visiting the Events page and clicking on the event you want to attend. Some events may require registration fees.', 'events', 6, true),
('Can I volunteer for your organization?', 'Yes, we welcome volunteers! Please contact us through our contact form or email us directly to learn about current volunteer opportunities.', 'general', 7, true),
('How can I access the digital library?', 'Members have access to our digital library containing Sanskrit texts, religious books, and educational materials. You can access it through your member portal after logging in.', 'library', 8, true),
('What payment methods do you accept?', 'We accept payments through eSewa, Khalti, PayPal, Stripe, IME Pay, ConnectIPS, bank transfers, and cash payments at our office.', 'payment', 9, true),
('How can I verify my certificate?', 'You can verify any certificate issued by our organization by visiting our verification page and entering the verification code printed on your certificate.', 'certificate', 10, true)
ON CONFLICT DO NOTHING;

-- Insert sample team members
INSERT INTO team_members (name, position, bio, email, sort_order, is_active) VALUES
('Ram Prasad Sharma', 'President', 'Ram Prasad Sharma is a dedicated leader with over 20 years of experience in promoting Sanatan Dharma values and community service.', 'president@sanatandharma.org', 1, true),
('Sita Devi Poudel', 'Vice President', 'Sita Devi Poudel is passionate about education and has been instrumental in developing our educational programs and workshops.', 'vicepresident@sanatandharma.org', 2, true),
('Krishna Bahadur Thapa', 'Secretary', 'Krishna Bahadur Thapa manages our administrative affairs and ensures smooth operations of all organizational activities.', 'secretary@sanatandharma.org', 3, true),
('Radha Kumari Shrestha', 'Treasurer', 'Radha Kumari Shrestha oversees our financial management and ensures transparency in all financial transactions.', 'treasurer@sanatandharma.org', 4, true),
('Gopal Singh Rajput', 'Program Coordinator', 'Gopal Singh Rajput coordinates our events, workshops, and community outreach programs.', 'programs@sanatandharma.org', 5, true)
ON CONFLICT DO NOTHING;

-- Insert sample global presence locations
INSERT INTO global_presence (country, state_province, city, contact_person, contact_email, member_count, established_date, description, is_active) VALUES
('Nepal', 'Bagmati', 'Kathmandu', 'Ram Prasad Sharma', 'kathmandu@sanatandharma.org', 150, '2020-01-15', 'Main headquarters and primary center for all activities', true),
('Nepal', 'Gandaki', 'Pokhara', 'Laxmi Devi Gurung', 'pokhara@sanatandharma.org', 75, '2021-03-20', 'Regional center serving the Gandaki province', true),
('Nepal', 'Lumbini', 'Butwal', 'Hari Prasad Pandey', 'butwal@sanatandharma.org', 45, '2021-08-10', 'Center focusing on pilgrimage and spiritual activities', true),
('India', 'Uttar Pradesh', 'Varanasi', 'Pandit Vishnu Sharma', 'varanasi@sanatandharma.org', 30, '2022-01-01', 'International center for Sanskrit studies and research', true),
('USA', 'California', 'Los Angeles', 'Dr. Rajesh Patel', 'losangeles@sanatandharma.org', 25, '2022-06-15', 'Serving the Nepali and Hindu community in California', true),
('UK', 'England', 'London', 'Sushma Adhikari', 'london@sanatandharma.org', 20, '2022-09-01', 'European center for cultural and educational activities', true)
ON CONFLICT DO NOTHING;

-- Insert sample policies
INSERT INTO policies (title, slug, content, type, version, effective_date, is_active) VALUES
('Privacy Policy', 'privacy-policy', 
'<h2>Privacy Policy</h2>
<p>This Privacy Policy describes how Sanatan Dharma Bikash Nepal collects, uses, and protects your personal information.</p>
<h3>Information We Collect</h3>
<p>We collect information you provide directly to us, such as when you create an account, make a donation, register for events, or contact us.</p>
<h3>How We Use Your Information</h3>
<p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
<h3>Information Sharing</h3>
<p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
<h3>Data Security</h3>
<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
<h3>Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at privacy@sanatandharma.org.</p>',
'privacy', '1.0', '2024-01-01', true),

('Terms of Service', 'terms-of-service',
'<h2>Terms of Service</h2>
<p>These Terms of Service govern your use of the Sanatan Dharma Bikash Nepal website and services.</p>
<h3>Acceptance of Terms</h3>
<p>By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement.</p>
<h3>Membership</h3>
<p>Membership is open to individuals who support our mission and values. Members must provide accurate information and maintain the confidentiality of their account.</p>
<h3>Donations</h3>
<p>All donations are voluntary and non-refundable unless otherwise specified. Donation receipts will be provided for tax purposes.</p>
<h3>Events</h3>
<p>Event registration is subject to availability. Cancellation policies may vary by event and will be clearly stated during registration.</p>
<h3>Prohibited Uses</h3>
<p>You may not use our services for any unlawful purpose or to solicit others to perform unlawful acts.</p>
<h3>Limitation of Liability</h3>
<p>Sanatan Dharma Bikash Nepal shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>',
'terms', '1.0', '2024-01-01', true),

('Refund Policy', 'refund-policy',
'<h2>Refund Policy</h2>
<p>This policy outlines the conditions under which refunds may be provided.</p>
<h3>Membership Fees</h3>
<p>Membership fees are generally non-refundable. However, refunds may be considered in exceptional circumstances within 7 days of payment.</p>
<h3>Event Registration</h3>
<p>Event registration fees may be refunded if cancellation is made at least 48 hours before the event. Processing fees may apply.</p>
<h3>Donations</h3>
<p>Donations are typically non-refundable as they are considered voluntary contributions to our cause.</p>
<h3>Refund Process</h3>
<p>To request a refund, please contact us at refunds@sanatandharma.org with your transaction details and reason for the refund request.</p>
<h3>Processing Time</h3>
<p>Approved refunds will be processed within 7-10 business days and credited back to the original payment method.</p>',
'refund', '1.0', '2024-01-01', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample official documents
INSERT INTO official_documents (title, description, document_type, issue_date, issuing_authority, document_number, is_public) VALUES
('Organization Registration Certificate', 'Official registration certificate from the Government of Nepal', 'registration', '2020-01-01', 'Department of Industry, Government of Nepal', 'REG-2020-001', true),
('Tax Exemption Certificate', 'Certificate confirming tax-exempt status for donations', 'tax_exemption', '2020-02-15', 'Inland Revenue Department, Nepal', 'TAX-EX-2020-001', true),
('NGO License', 'License to operate as a non-governmental organization', 'license', '2020-01-15', 'Social Welfare Council, Nepal', 'NGO-LIC-2020-001', false)
ON CONFLICT DO NOTHING;

-- Insert sample blog categories and content
INSERT INTO blogs (title, slug, excerpt, content, author_name, category, status, is_featured, published_at, meta_title, meta_description) VALUES
('Welcome to Sanatan Dharma Bikash Nepal', 'welcome-to-sanatan-dharma-bikash-nepal',
'We are excited to launch our new website and share our mission with the world.',
'<p>Welcome to the official website of Sanatan Dharma Bikash Nepal! We are thrilled to share our journey and mission with you through this digital platform.</p>
<p>Our organization has been dedicated to preserving and promoting the timeless values of Sanatan Dharma through education, community service, and cultural activities. This website serves as a bridge connecting our community members, supporters, and anyone interested in learning about our rich cultural heritage.</p>
<p>Here, you will find information about our upcoming events, educational programs, membership opportunities, and ways to contribute to our noble cause. We believe that by working together, we can create a positive impact in our society while staying true to our spiritual and cultural roots.</p>
<p>We invite you to explore our website, join our community, and be part of this meaningful journey. Together, we can build a stronger, more connected community that honors our traditions while embracing progress.</p>',
'Ram Prasad Sharma', 'Announcements', 'published', true, NOW(), 
'Welcome to Sanatan Dharma Bikash Nepal - Official Website Launch', 
'Join us in our mission to preserve and promote Sanatan Dharma values through education and community service.'),

('The Importance of Community Service in Sanatan Dharma', 'importance-of-community-service-sanatan-dharma',
'Exploring how community service (seva) is fundamental to the practice of Sanatan Dharma.',
'<p>Community service, known as "seva" in Sanskrit, is one of the fundamental principles of Sanatan Dharma. It represents selfless service to others without expecting anything in return, embodying the spirit of compassion and unity that lies at the heart of our tradition.</p>
<p>In the Bhagavad Gita, Lord Krishna emphasizes the importance of performing our duties without attachment to the results. This principle applies beautifully to community service, where we serve others not for personal gain but as an expression of our spiritual practice.</p>
<p>Through seva, we learn to transcend our ego and connect with the divine presence in all beings. Whether it''s helping the elderly, feeding the hungry, educating children, or protecting the environment, every act of service becomes a form of worship.</p>
<p>Our organization encourages all members to participate in community service activities. These experiences not only benefit those we serve but also contribute to our own spiritual growth and understanding of dharma.</p>',
'Sita Devi Poudel', 'Spirituality', 'published', false, NOW() - INTERVAL '7 days',
'The Importance of Community Service in Sanatan Dharma',
'Discover how seva (community service) is fundamental to spiritual practice in Sanatan Dharma tradition.'),

('Upcoming Festival Celebrations', 'upcoming-festival-celebrations',
'Join us for our upcoming festival celebrations and cultural events.',
'<p>We are excited to announce our upcoming festival celebrations that will bring our community together in joy and devotion. These festivals are not just celebrations but opportunities to connect with our cultural roots and strengthen our spiritual bonds.</p>
<p>Our upcoming events include:</p>
<ul>
<li><strong>Dashain Festival Celebration</strong> - A grand celebration with traditional rituals, cultural programs, and community feast</li>
<li><strong>Tihar Festival of Lights</strong> - Lighting ceremonies, cultural performances, and traditional games</li>
<li><strong>Holi Color Festival</strong> - Celebrating the victory of good over evil with colors, music, and dance</li>
<li><strong>Krishna Janmashtami</strong> - Devotional programs, bhajans, and spiritual discourses</li>
</ul>
<p>These celebrations are open to all community members and their families. We encourage everyone to participate and experience the joy of our shared cultural heritage.</p>',
'Gopal Singh Rajput', 'Events', 'published', true, NOW() - INTERVAL '3 days',
'Upcoming Festival Celebrations - Sanatan Dharma Bikash Nepal',
'Join our community for upcoming festival celebrations including Dashain, Tihar, Holi, and Krishna Janmashtami.')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample library items
INSERT INTO library (title, slug, description, author, language, category, status, download_count) VALUES
('Bhagavad Gita - Complete Text', 'bhagavad-gita-complete-text',
'The complete text of the Bhagavad Gita with Sanskrit verses and English translations.',
'Sage Vyasa', 'English', 'Sacred Texts', 'published', 0),

('Introduction to Sanskrit Language', 'introduction-to-sanskrit-language',
'A beginner-friendly guide to learning Sanskrit language and its fundamentals.',
'Dr. Pandit Sharma', 'English', 'Education', 'published', 0),

('Hindu Festivals and Their Significance', 'hindu-festivals-and-significance',
'Comprehensive guide to major Hindu festivals, their history, and spiritual significance.',
'Various Authors', 'English', 'Culture', 'published', 0),

('Yoga and Meditation Practices', 'yoga-and-meditation-practices',
'Practical guide to yoga asanas and meditation techniques for spiritual development.',
'Swami Yogananda', 'English', 'Spirituality', 'published', 0)
ON CONFLICT (slug) DO NOTHING;

-- Create a cleanup job (this would typically be run by a cron job)
-- For now, we'll just create the function call
SELECT cleanup_expired_data();
