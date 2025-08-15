import { createServerSupabaseClient } from "../lib/supabase"

async function initDatabase() {
  console.log("Initializing database...")
  const supabase = createServerSupabaseClient()

  // Create tables

  // Members table
  console.log("Creating members table...")
  await supabase.rpc("create_table_if_not_exists", {
    table_name: "members",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      serial_number text unique not null,
      full_name text not null,
      email text unique not null,
      phone text not null,
      address text not null,
      date_of_birth date not null,
      membership_type text not null,
      start_date date not null,
      end_date date,
      is_active boolean default true,
      referral_code text,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  // Events table
  console.log("Creating events table...")
  await supabase.rpc("create_table_if_not_exists", {
    table_name: "events",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      title text not null,
      description text not null,
      image_url text,
      event_date date not null,
      start_time time not null,
      end_time time not null,
      location text not null,
      category text not null,
      is_paid boolean default false,
      price numeric,
      max_participants integer,
      current_participants integer default 0,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  // Projects table
  console.log("Creating projects table...")
  await supabase.rpc("create_table_if_not_exists", {
    table_name: "projects",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      title text not null,
      description text not null,
      image_url text,
      goal_amount numeric not null,
      raised_amount numeric default 0,
      currency text default 'NPR',
      status text not null,
      start_date date not null,
      end_date date,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  // Blogs table
  console.log("Creating blogs table...")
  await supabase.rpc("create_table_if_not_exists", {
    table_name: "blogs",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      title text not null,
      excerpt text not null,
      content text not null,
      image_url text,
      author text not null,
      category text not null,
      published_at timestamp with time zone default now(),
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  // Library items table
  console.log("Creating library_items table...")
  await supabase.rpc("create_table_if_not_exists", {
    table_name: "library_items",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      title text not null,
      description text not null,
      type text not null,
      file_url text,
      thumbnail_url text,
      is_free boolean default true,
      category text not null,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  // Donations table
  console.log("Creating donations table...")
  await supabase.rpc("create_table_if_not_exists", {
    table_name: "donations",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      donor_name text not null,
      donor_email text,
      donor_phone text,
      amount numeric not null,
      currency text default 'NPR',
      project_id uuid references projects(id),
      payment_method text not null,
      transaction_id text,
      receipt_number text unique not null,
      created_at timestamp with time zone default now()
    `,
  })

  // Certificates table
  console.log("Creating certificates table...")
  await supabase.rpc("create_table_if_not_exists", {
    table_name: "certificates",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      serial_number text unique not null,
      recipient_name text not null,
      recipient_email text not null,
      certificate_type text not null,
      issued_date date not null,
      pdf_url text not null,
      created_at timestamp with time zone default now()
    `,
  })

  // FAQs table
  console.log("Creating faqs table...")
  await supabase.rpc("create_table_if_not_exists", {
    table_name: "faqs",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      question text not null,
      answer text not null,
      page_id text not null,
      order_index integer default 0,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  // Settings table
  console.log("Creating settings table...")
  await supabase.rpc("create_table_if_not_exists", {
    table_name: "settings",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      key text unique not null,
      value text not null,
      description text,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  console.log("Database initialization complete!")
}

// Run the initialization
initDatabase().catch((error) => {
  console.error("Error initializing database:", error)
  process.exit(1)
})
