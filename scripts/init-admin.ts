import { createClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

async function initializeAdmin() {
  const supabase = createClient()

  try {
    console.log("Creating admin tables...")

    // Create admin_users table
    const { error: adminUsersError } = await supabase.rpc("create_admin_users_table")
    if (adminUsersError && !adminUsersError.message.includes("already exists")) {
      console.error("Error creating admin_users table:", adminUsersError)
    }

    // Create admin_sessions table
    const { error: adminSessionsError } = await supabase.rpc("create_admin_sessions_table")
    if (adminSessionsError && !adminSessionsError.message.includes("already exists")) {
      console.error("Error creating admin_sessions table:", adminSessionsError)
    }

    console.log("Creating default admin user...")

    // Hash the default password
    const hashedPassword = await bcrypt.hash("admin123", 12)

    // Insert default admin user
    const { error: insertError } = await supabase.from("admin_users").upsert({
      username: "admin",
      password_hash: hashedPassword,
      role: "super_admin",
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error creating admin user:", insertError)
    } else {
      console.log("✅ Admin user created successfully!")
      console.log("Username: admin")
      console.log("Password: admin123")
    }

    console.log("✅ Admin initialization complete!")
  } catch (error) {
    console.error("❌ Error initializing admin:", error)
  }
}

// Run the initialization
initializeAdmin()
