import { createServerSupabaseClient } from "../lib/supabase"

async function seedDatabase() {
  console.log("Seeding database with initial data...")
  const supabase = createServerSupabaseClient()

  // Seed settings
  console.log("Seeding settings...")
  const settingsData = [
    { key: "site_name", value: "Sanatan Dharma Bigyan Samaj", description: "Name of the organization" },
    {
      key: "site_description",
      value: "Promoting Sanatan Dharma values and education in Nepal",
      description: "Short description of the organization",
    },
    { key: "contact_email", value: "info@sdbnepal.org", description: "Primary contact email" },
    { key: "contact_phone", value: "+977 1234567890", description: "Primary contact phone" },
    { key: "contact_address", value: "Kathmandu, Nepal", description: "Physical address" },
    { key: "facebook_url", value: "https://facebook.com/sdbnepal", description: "Facebook page URL" },
    { key: "youtube_url", value: "https://youtube.com/sdbnepal", description: "YouTube channel URL" },
    { key: "linkedin_url", value: "https://linkedin.com/company/sdbnepal", description: "LinkedIn page URL" },
    { key: "instagram_url", value: "https://instagram.com/sdbnepal", description: "Instagram profile URL" },
    { key: "home_page_video", value: "dQw4w9WgXcQ", description: "YouTube video ID for home page" },
    { key: "about_page_video", value: "dQw4w9WgXcQ", description: "YouTube video ID for about page" },
  ]

  for (const setting of settingsData) {
    await supabase.from("settings").upsert(setting, { onConflict: "key" })
  }

  // Seed FAQs
  console.log("Seeding FAQs...")
  const faqsData = [
    {
      question: "What is Sanatan Dharma Bigyan Samaj?",
      answer:
        "Sanatan Dharma Bigyan Samaj (SDB Nepal) is an organization dedicated to preserving and promoting the values and teachings of Sanatan Dharma through education, community service, and cultural programs.",
      page_id: "home",
      order_index: 1,
    },
    {
      question: "How can I become a member?",
      answer:
        'You can become a member by visiting our "Apply for Membership" page and filling out the application form. We offer both general and lifetime membership options.',
      page_id: "home",
      order_index: 2,
    },
    {
      question: "What types of events do you organize?",
      answer:
        "We organize various events including Gurukul admissions, pilgrimages to sacred sites, Sanskrit learning workshops, Vedic mathematics training, and cultural celebrations.",
      page_id: "home",
      order_index: 3,
    },
    {
      question: "How can I support your initiatives?",
      answer:
        "You can support our initiatives by donating to specific projects, becoming a member, volunteering your time, or participating in our events and programs.",
      page_id: "home",
      order_index: 4,
    },
    {
      question: "Do you offer online courses?",
      answer:
        "Yes, we offer various online courses including Sanskrit learning, Vedic mathematics, and other educational programs related to Sanatan Dharma.",
      page_id: "home",
      order_index: 5,
    },
  ]

  await supabase.from("faqs").upsert(faqsData, { onConflict: "id" })

  // Seed sample projects
  console.log("Seeding projects...")
  const projectsData = [
    {
      title: "Gurukul Expansion Project",
      description: "Help us expand our Gurukul facilities to accommodate more students.",
      image_url: "/placeholder.svg?height=300&width=500",
      goal_amount: 500000,
      raised_amount: 325000,
      currency: "NPR",
      status: "ongoing",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    {
      title: "Sanskrit Library Development",
      description: "Building a comprehensive library of Sanskrit texts and resources.",
      image_url: "/placeholder.svg?height=300&width=500",
      goal_amount: 300000,
      raised_amount: 150000,
      currency: "NPR",
      status: "ongoing",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    {
      title: "Community Outreach Program",
      description: "Supporting underprivileged communities with education and resources.",
      image_url: "/placeholder.svg?height=300&width=500",
      goal_amount: 200000,
      raised_amount: 180000,
      currency: "NPR",
      status: "ongoing",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  ]

  await supabase.from("projects").upsert(projectsData, { onConflict: "id" })

  console.log("Database seeding complete!")
}

// Run the seeding
seedDatabase().catch((error) => {
  console.error("Error seeding database:", error)
  process.exit(1)
})
