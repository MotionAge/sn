-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE membership_type AS ENUM ('basic', 'premium', 'lifetime', 'student', 'senior');
CREATE TYPE membership_status AS ENUM ('pending', 'active', 'expired', 'suspended', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');
CREATE TYPE payment_gateway AS ENUM ('esewa', 'khalti', 'imepay', 'connectips', 'paypal', 'stripe', 'bank_transfer');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'attended');
CREATE TYPE donation_type AS ENUM ('general', 'event', 'project', 'emergency', 'monthly');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'member', 'guest');
CREATE TYPE certificate_type AS ENUM ('membership', 'donation', 'event_participation', 'achievement');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nepal',
    postal_code VARCHAR(20),
    membership_type membership_type NOT NULL,
    membership_status membership_status DEFAULT 'pending',
    join_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    payment_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status payment_status DEFAULT 'pending',
    payment_id VARCHAR(100),
    transaction_id VARCHAR(100),
    payment_verified_at TIMESTAMP WITH TIME ZONE,
    profile_image_url TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    occupation VARCHAR(100),
    education VARCHAR(100),
    interests TEXT[],
    how_did_you_hear VARCHAR(100),
    referral_code VARCHAR(20),
    referred_by UUID REFERENCES members(id),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nepal',
    max_participants INTEGER,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    registration_deadline DATE,
    featured_image_url TEXT,
    gallery_images TEXT[],
    organizer_name VARCHAR(255),
    organizer_email VARCHAR(255),
    organizer_phone VARCHAR(20),
    requirements TEXT,
    what_to_bring TEXT,
    tags TEXT[],
    status event_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_registrations table
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id VARCHAR(20) UNIQUE NOT NULL,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    participant_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    participant_phone VARCHAR(20),
    participant_age INTEGER,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    dietary_requirements TEXT,
    special_requests TEXT,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    registration_fee DECIMAL(10,2) DEFAULT 0,
    payment_method VARCHAR(50),
    payment_status payment_status DEFAULT 'pending',
    payment_id VARCHAR(100),
    transaction_id VARCHAR(100),
    registration_status registration_status DEFAULT 'pending',
    attended BOOLEAN DEFAULT false,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    certificate_issued BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id VARCHAR(20) UNIQUE NOT NULL,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255),
    donor_phone VARCHAR(20),
    donor_address TEXT,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NPR',
    donation_type donation_type DEFAULT 'general',
    purpose VARCHAR(255),
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    payment_method VARCHAR(50),
    payment_gateway payment_gateway,
    payment_status payment_status DEFAULT 'pending',
    payment_id VARCHAR(100),
    transaction_id VARCHAR(100),
    gateway_transaction_id VARCHAR(100),
    payment_verified_at TIMESTAMP WITH TIME ZONE,
    receipt_url TEXT,
    tax_deductible BOOLEAN DEFAULT true,
    project_id UUID,
    event_id UUID REFERENCES events(id),
    member_id UUID REFERENCES members(id),
    recurring_donation_id UUID,
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency VARCHAR(20), -- monthly, quarterly, yearly
    next_donation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    author_name VARCHAR(255),
    author_bio TEXT,
    author_image_url TEXT,
    tags TEXT[],
    category VARCHAR(100),
    status content_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    reading_time INTEGER, -- in minutes
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create library table
CREATE TABLE library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    file_url TEXT,
    file_type VARCHAR(50),
    file_size BIGINT,
    thumbnail_url TEXT,
    author VARCHAR(255),
    language VARCHAR(50) DEFAULT 'Nepali',
    category VARCHAR(100),
    tags TEXT[],
    isbn VARCHAR(20),
    publication_year INTEGER,
    publisher VARCHAR(255),
    page_count INTEGER,
    download_count INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    status content_status DEFAULT 'draft',
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    featured_image_url TEXT,
    gallery_images TEXT[],
    goal_amount DECIMAL(12,2),
    raised_amount DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'NPR',
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    beneficiaries INTEGER,
    category VARCHAR(100),
    tags TEXT[],
    status content_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    reference_type VARCHAR(50) NOT NULL, -- 'donation', 'membership', 'event_registration'
    reference_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NPR',
    payment_gateway payment_gateway NOT NULL,
    gateway_transaction_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    status payment_status DEFAULT 'pending',
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    description TEXT,
    metadata JSONB,
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id VARCHAR(50) UNIQUE NOT NULL,
    certificate_type certificate_type NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issue_date DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    pdf_url TEXT,
    verification_code VARCHAR(100) UNIQUE NOT NULL,
    member_id UUID REFERENCES members(id),
    event_id UUID REFERENCES events(id),
    donation_id UUID REFERENCES donations(id),
    issued_by UUID REFERENCES admin_users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faqs table
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create global_presence table
CREATE TABLE global_presence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    address TEXT,
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    member_count INTEGER DEFAULT 0,
    established_date DATE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    social_links JSONB,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create policies table
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50), -- 'privacy', 'terms', 'refund', etc.
    version VARCHAR(10) DEFAULT '1.0',
    effective_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create official_documents table
CREATE TABLE official_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    document_type VARCHAR(100), -- 'registration', 'license', 'certificate', etc.
    issue_date DATE,
    expiry_date DATE,
    issuing_authority VARCHAR(255),
    document_number VARCHAR(100),
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_logs table
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    to_email VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT,
    template_used VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    error_message TEXT,
    reference_type VARCHAR(50),
    reference_id VARCHAR(100),
    metadata JSONB,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file_uploads table
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES admin_users(id),
    reference_type VARCHAR(50),
    reference_id UUID,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    category VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES admin_users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create approvals table
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_type VARCHAR(50) NOT NULL, -- 'membership', 'donation', 'event_registration'
    reference_id UUID NOT NULL,
    status approval_status DEFAULT 'pending',
    requested_by UUID,
    approved_by UUID REFERENCES admin_users(id),
    rejection_reason TEXT,
    notes TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_requests table
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_type VARCHAR(50) NOT NULL, -- 'certificate', 'membership', 'donation'
    verification_code VARCHAR(100) NOT NULL,
    reference_id UUID,
    requester_name VARCHAR(255),
    requester_email VARCHAR(255),
    requester_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'invalid'
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
