import { createServerSupabaseClient } from "../lib/supabase"

async function seedComprehensiveData() {
  console.log("Seeding comprehensive data...")
  const supabase = createServerSupabaseClient()

  // Seed Members
  console.log("Seeding members...")
  const membersData = [
    {
      member_id: "M2024001",
      full_name: "राम बहादुर श्रेष्ठ",
      email: "ram.shrestha@email.com",
      phone: "+977-9841234567",
      address: "Kathmandu-15, Nepal",
      membership_type: "lifetime",
      status: "active",
      join_date: "2024-01-15",
      expiry_date: null,
      payment_amount: 10000,
      payment_method: "esewa",
      transaction_id: "ESW123456789",
      certificate_number: "CERT-M-2024-001",
      approved_by: "admin",
      approved_date: "2024-01-15",
    },
    {
      member_id: "M2024002",
      full_name: "सीता देवी पौडेल",
      email: "sita.poudel@email.com",
      phone: "+977-9851234567",
      address: "Pokhara-8, Nepal",
      membership_type: "annual",
      status: "active",
      join_date: "2024-01-20",
      expiry_date: "2025-01-20",
      payment_amount: 2000,
      payment_method: "khalti",
      transaction_id: "KHT987654321",
      certificate_number: "CERT-M-2024-002",
      approved_by: "admin",
      approved_date: "2024-01-20",
    },
    {
      member_id: "M2024003",
      full_name: "गीता राई",
      email: "geeta.rai@email.com",
      phone: "+977-9861234567",
      address: "Chitwan-5, Nepal",
      membership_type: "annual",
      status: "expired",
      join_date: "2023-03-10",
      expiry_date: "2024-03-10",
      payment_amount: 2000,
      payment_method: "bank_transfer",
      transaction_id: "BT456789123",
      certificate_number: "CERT-M-2023-015",
      approved_by: "admin",
      approved_date: "2023-03-10",
    },
    {
      member_id: "M2024004",
      full_name: "अनिता जोशी",
      email: "anita.joshi@email.com",
      phone: "+977-9871234567",
      address: "Lalitpur-3, Nepal",
      membership_type: "annual",
      status: "pending",
      join_date: "2024-06-25",
      expiry_date: "2025-06-25",
      payment_amount: 2000,
      payment_method: "esewa",
      transaction_id: "ESW789456123",
      certificate_number: null,
      approved_by: null,
      approved_date: null,
    },
  ]

  await supabase.from("members").upsert(membersData, { onConflict: "member_id" })

  // Seed Donations
  console.log("Seeding donations...")
  const donationsData = [
    {
      donation_id: "D2024001",
      donor_name: "अनिल कुमार गुरुङ",
      donor_email: "anil.gurung@email.com",
      donor_phone: "+977-9861234567",
      amount: 5000,
      currency: "NPR",
      purpose: "Temple Construction",
      payment_method: "bank_transfer",
      transaction_id: "BT456789123",
      donation_date: "2024-01-13",
      receipt_number: "REC-D-2024-001",
      status: "pending",
      approved_by: null,
      approved_date: null,
    },
    {
      donation_id: "D2024002",
      donor_name: "सुनिता राई",
      donor_email: "sunita.rai@email.com",
      donor_phone: "+977-9871234567",
      amount: 3000,
      currency: "NPR",
      purpose: "Education Fund",
      payment_method: "esewa",
      transaction_id: "ESW789123456",
      donation_date: "2024-01-12",
      receipt_number: "REC-D-2024-002",
      status: "approved",
      approved_by: "admin",
      approved_date: "2024-01-12",
    },
    {
      donation_id: "D2024003",
      donor_name: "हरि प्रसाद थापा",
      donor_email: "hari.thapa@email.com",
      donor_phone: "+977-9881234567",
      amount: 7500,
      currency: "NPR",
      purpose: "General Donation",
      payment_method: "khalti",
      transaction_id: "KHT123789456",
      donation_date: "2024-01-10",
      receipt_number: "REC-D-2024-003",
      status: "approved",
      approved_by: "admin",
      approved_date: "2024-01-10",
    },
  ]

  await supabase.from("donations").upsert(donationsData, { onConflict: "donation_id" })

  // Seed Events
  console.log("Seeding events...")
  const eventsData = [
    {
      event_id: "E2024001",
      title: "Sanskrit Workshop 2024",
      title_nepali: "संस्कृत कार्यशाला २०२४",
      description: "Learn the basics of Sanskrit language and literature",
      description_nepali: "संस्कृत भाषा र साहित्यका आधारभूत कुराहरू सिक्नुहोस्",
      category: "sanskrit-workshop",
      start_date: "2024-02-15",
      end_date: "2024-02-17",
      start_time: "09:00",
      end_time: "17:00",
      venue: "SDB Nepal Center",
      venue_nepali: "एसडीबी नेपाल केन्द्र",
      address: "Kathmandu, Nepal",
      capacity: 50,
      registration_fee: 1500,
      currency: "NPR",
      registration_required: true,
      registration_deadline: "2024-02-10",
      contact_person: "Dr. Sharma",
      contact_phone: "+977-1-4567890",
      contact_email: "events@sdbnepal.org",
      status: "published",
      featured: true,
    },
    {
      event_id: "E2024002",
      title: "Vedic Mathematics Training",
      title_nepali: "वैदिक गणित तालिम",
      description: "Advanced techniques in Vedic Mathematics",
      description_nepali: "वैदिक गणितका उन्नत प्रविधिहरू",
      category: "vedic-math",
      start_date: "2024-03-01",
      end_date: "2024-03-03",
      start_time: "10:00",
      end_time: "16:00",
      venue: "Community Hall",
      venue_nepali: "सामुदायिक हल",
      address: "Pokhara, Nepal",
      capacity: 30,
      registration_fee: 2000,
      currency: "NPR",
      registration_required: true,
      registration_deadline: "2024-02-25",
      contact_person: "Prof. Poudel",
      contact_phone: "+977-61-123456",
      contact_email: "math@sdbnepal.org",
      status: "published",
      featured: false,
    },
  ]

  await supabase.from("events").upsert(eventsData, { onConflict: "event_id" })

  // Seed Event Registrations
  console.log("Seeding event registrations...")
  const eventRegistrationsData = [
    {
      registration_id: "ER2024001",
      event_id: "E2024001",
      participant_name: "गीता शर्मा",
      participant_email: "geeta.sharma@email.com",
      participant_phone: "+977-9881234567",
      registration_fee: 1500,
      payment_method: "khalti",
      transaction_id: "KHT456789123",
      registration_date: "2024-01-10",
      special_requests: "Vegetarian meals required",
      status: "pending",
      approved_by: null,
      approved_date: null,
    },
    {
      registration_id: "ER2024002",
      event_id: "E2024001",
      participant_name: "राज कुमार श्रेष्ठ",
      participant_email: "raj.shrestha@email.com",
      participant_phone: "+977-9891234567",
      registration_fee: 1500,
      payment_method: "esewa",
      transaction_id: "ESW123789456",
      registration_date: "2024-01-12",
      special_requests: null,
      status: "approved",
      approved_by: "admin",
      approved_date: "2024-01-12",
    },
  ]

  await supabase.from("event_registrations").upsert(eventRegistrationsData, { onConflict: "registration_id" })

  // Seed Blog Posts
  console.log("Seeding blog posts...")
  const blogPostsData = [
    {
      post_id: "BP2024001",
      title: "गीता जयन्ती महोत्सवको तयारी",
      title_english: "Preparation for Gita Jayanti Festival",
      excerpt: "यस वर्षको गीता जयन्ती महोत्सवका लागि विशेष तयारी भइरहेको छ...",
      excerpt_english: "Special preparations are underway for this year's Gita Jayanti festival...",
      content: "गीता जयन्ती हिन्दू धर्मको एक महत्वपूर्ण पर्व हो। यस वर्ष हामी विशेष कार्यक्रमहरूको आयोजना गर्दैछौं।",
      content_english:
        "Gita Jayanti is an important festival in Hindu religion. This year we are organizing special programs.",
      category: "events",
      author: "Admin",
      status: "published",
      publish_date: "2024-01-15",
      featured: true,
      views: 1247,
      likes: 89,
      comments: 23,
      shares: 45,
      meta_title: "Gita Jayanti Festival 2024",
      meta_description: "Join us for the grand Gita Jayanti celebration",
      tags: ["festival", "gita", "celebration", "hindu"],
    },
    {
      post_id: "BP2024002",
      title: "नयाँ सदस्यता योजना सुरु",
      title_english: "New Membership Plan Launched",
      excerpt: "संस्थाले नयाँ सदस्यता योजना सुरु गरेको छ जसमा विशेष छुट...",
      excerpt_english: "The organization has launched a new membership plan with special discounts...",
      content: "हाम्रो संस्थाले सदस्यहरूका लागि नयाँ योजना ल्याएको छ। यसमा धेरै सुविधाहरू छन्।",
      content_english: "Our organization has brought a new plan for members. It has many facilities.",
      category: "press-release",
      author: "Admin",
      status: "published",
      publish_date: "2024-01-10",
      featured: false,
      views: 892,
      likes: 67,
      comments: 12,
      shares: 28,
      meta_title: "New Membership Benefits",
      meta_description: "Discover our new membership benefits and plans",
      tags: ["membership", "benefits", "announcement"],
    },
  ]

  await supabase.from("blog_posts").upsert(blogPostsData, { onConflict: "post_id" })

  // Seed Library Items
  console.log("Seeding library items...")
  const libraryItemsData = [
    {
      item_id: "LIB2024001",
      title: "भगवद्गीता",
      title_english: "Bhagavad Gita",
      author: "व्यास",
      author_english: "Vyasa",
      description: "हिन्दू धर्मको पवित्र ग्रन्थ",
      description_english: "Sacred text of Hindu religion",
      category: "religious-texts",
      language: "sanskrit",
      file_type: "pdf",
      file_size: "2.5 MB",
      file_url: "/library/bhagavad-gita.pdf",
      cover_image: "/placeholder.svg?height=300&width=200",
      isbn: "978-81-7223-000-1",
      publication_year: "2020",
      publisher: "SDB Publications",
      pages: 700,
      access_level: "public",
      download_count: 1247,
      rating: 4.8,
      status: "active",
    },
    {
      item_id: "LIB2024002",
      title: "वैदिक गणित",
      title_english: "Vedic Mathematics",
      author: "जगद्गुरु स्वामी भारती कृष्ण तीर्थ",
      author_english: "Jagadguru Swami Bharati Krishna Tirtha",
      description: "प्राचीन भारतीय गणितका सूत्रहरू",
      description_english: "Ancient Indian mathematical formulas",
      category: "mathematics",
      language: "nepali",
      file_type: "pdf",
      file_size: "1.8 MB",
      file_url: "/library/vedic-mathematics.pdf",
      cover_image: "/placeholder.svg?height=300&width=200",
      isbn: "978-81-7223-001-8",
      publication_year: "2019",
      publisher: "SDB Publications",
      pages: 450,
      access_level: "members",
      download_count: 892,
      rating: 4.6,
      status: "active",
    },
  ]

  await supabase.from("library_items").upsert(libraryItemsData, { onConflict: "item_id" })

  // Seed Certificate Logs
  console.log("Seeding certificate logs...")
  const certificateLogsData = [
    {
      certificate_id: "CERT-M-2024-001",
      member_id: "M2024001",
      member_name: "राम बहादुर श्रेष्ठ",
      certificate_type: "membership",
      issue_date: "2024-01-15",
      valid_until: null, // Lifetime
      status: "active",
      download_count: 5,
      last_downloaded: "2024-01-20",
      generated_by: "admin",
      verification_code: "SDB-2024-M-001-VERIFY",
    },
    {
      certificate_id: "CERT-E-2024-001",
      member_id: "M2024002",
      member_name: "सीता देवी पौडेल",
      certificate_type: "event_participation",
      issue_date: "2024-01-10",
      valid_until: null, // No expiry for event certificates
      status: "active",
      download_count: 2,
      last_downloaded: "2024-01-12",
      generated_by: "system",
      verification_code: "SDB-2024-E-001-VERIFY",
    },
    {
      certificate_id: "REC-D-2024-001",
      member_id: null,
      member_name: "अनिल कुमार गुरुङ",
      certificate_type: "donation_receipt",
      issue_date: "2024-01-13",
      valid_until: null,
      status: "active",
      download_count: 1,
      last_downloaded: "2024-01-13",
      generated_by: "admin",
      verification_code: "SDB-2024-D-001-VERIFY",
    },
  ]

  await supabase.from("certificate_logs").upsert(certificateLogsData, { onConflict: "certificate_id" })

  // Seed Global Presence
  console.log("Seeding global presence...")
  const globalPresenceData = [
    {
      branch_id: "BR2024001",
      country: "Nepal",
      city: "Kathmandu",
      branch_name: "SDB Nepal Headquarters",
      branch_name_local: "एसडीबी नेपाल मुख्यालय",
      address: "Kathmandu-15, Nepal",
      coordinator_name: "Dr. राम प्रसाद शर्मा",
      coordinator_email: "kathmandu@sdbnepal.org",
      coordinator_phone: "+977-1-4567890",
      established_date: "2020-01-01",
      member_count: 450,
      status: "active",
      description: "Main headquarters of SDB Nepal",
      description_local: "एसडीबी नेपालको मुख्य कार्यालय",
    },
    {
      branch_id: "BR2024002",
      country: "Nepal",
      city: "Pokhara",
      branch_name: "SDB Pokhara Branch",
      branch_name_local: "एसडीबी पोखरा शाखा",
      address: "Pokhara-8, Nepal",
      coordinator_name: "Prof. सीता देवी पौडेल",
      coordinator_email: "pokhara@sdbnepal.org",
      coordinator_phone: "+977-61-123456",
      established_date: "2021-06-15",
      member_count: 180,
      status: "active",
      description: "Pokhara regional branch",
      description_local: "पोखरा क्षेत्रीय शाखा",
    },
    {
      branch_id: "BR2024003",
      country: "India",
      city: "New Delhi",
      branch_name: "SDB India Chapter",
      branch_name_local: "एसडीबी भारत अध्याय",
      address: "New Delhi, India",
      coordinator_name: "Dr. Rajesh Kumar",
      coordinator_email: "delhi@sdbindia.org",
      coordinator_phone: "+91-11-12345678",
      established_date: "2022-03-20",
      member_count: 75,
      status: "active",
      description: "India chapter of SDB",
      description_local: "एसडीबीको भारतीय अध्याय",
    },
  ]

  await supabase.from("global_presence").upsert(globalPresenceData, { onConflict: "branch_id" })

  // Update existing settings with more comprehensive data
  console.log("Updating settings...")
  const additionalSettings = [
    { key: "membership_lifetime_fee", value: "10000", description: "Lifetime membership fee in NPR" },
    { key: "membership_annual_fee", value: "2000", description: "Annual membership fee in NPR" },
    { key: "auto_approve_donations", value: "false", description: "Auto approve donations below threshold" },
    { key: "donation_auto_approve_limit", value: "1000", description: "Auto approve donations below this amount" },
    { key: "certificate_auto_generate", value: "true", description: "Auto generate certificates on approval" },
    { key: "email_notifications_enabled", value: "true", description: "Enable email notifications" },
    { key: "sms_notifications_enabled", value: "false", description: "Enable SMS notifications" },
    { key: "payment_esewa_enabled", value: "true", description: "Enable eSewa payments" },
    { key: "payment_khalti_enabled", value: "true", description: "Enable Khalti payments" },
    { key: "payment_stripe_enabled", value: "false", description: "Enable Stripe payments" },
    { key: "google_translate_api_key", value: "", description: "Google Translate API key" },
    { key: "smtp_host", value: "smtp.gmail.com", description: "SMTP server host" },
    { key: "smtp_port", value: "587", description: "SMTP server port" },
    { key: "smtp_username", value: "", description: "SMTP username" },
    { key: "smtp_password", value: "", description: "SMTP password" },
  ]

  for (const setting of additionalSettings) {
    await supabase.from("settings").upsert(setting, { onConflict: "key" })
  }

  console.log("Comprehensive data seeding complete!")
}

// Run the seeding
seedComprehensiveData().catch((error) => {
  console.error("Error seeding comprehensive data:", error)
  process.exit(1)
})
