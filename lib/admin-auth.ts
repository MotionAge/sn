import { createClient } from "@/lib/supabase"
import bcrypt from "bcrypt"

export type AdminUserRow = {
  id: string
  username: string
  email: string
  role: "super_admin" | "admin" | "moderator"
  is_active: boolean
  password_hash: string
  last_login?: string // Changed from last_login_at to match your DB
  created_at: string
  updated_at: string
}

// Back-compat alias for consumers expecting AdminUser
export type AdminUser = AdminUserRow

export type AdminActivityLogRow = {
  id: string
  admin_id: string
  action: string
  resource_type?: string
  resource_id?: string
  details?: any
  created_at: string
}

export class AdminAuthService {
  private getSupabaseClient() {
    return createClient()
  }

  // -------------------------
  // New method
  // -------------------------
  async getCurrentUser(): Promise<AdminUserRow | null> {
    const supabase = this.getSupabaseClient()
    if (!supabase) return null

    // For example, you store current admin id in a cookie/session
    // Replace this with your actual session logic
    const adminId = process.env.CURRENT_ADMIN_ID
    if (!adminId) return null

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", adminId)
      .single()

    if (error || !data) return null
    return data as AdminUserRow
  }

  async login(username: string, password: string, ipAddress?: string, userAgent?: string) {
    const supabase = this.getSupabaseClient()
    if (!supabase) throw new Error("Database connection not available")

    console.log("🔍 Login attempt for username:", username)
    console.log("🔐 Input password length:", password.length)

    const { data: admin, error: userError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("is_active", true)
      .single()

    console.log("📊 Database query result:")
    console.log("- Error:", userError)
    console.log("- Data found:", !!admin)
    
    if (admin) {
      const adminUser = admin as AdminUserRow;
      console.log("- Admin data:", {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        is_active: adminUser.is_active,
        password_hash_length: adminUser.password_hash?.length,
        password_hash_prefix: adminUser.password_hash?.substring(0, 10) + "...",
        hash_algorithm: adminUser.password_hash?.substring(0, 4)
      })
    }

    if (userError) {
      console.error("❌ Database error:", userError)
      throw new Error("Invalid credentials")
    }
    
    if (!admin) {
      console.error("❌ No admin found with username:", username)
      throw new Error("Invalid credentials")
    }

    console.log("🔐 Starting password comparison...")
    console.log("- Stored hash algorithm:", (admin as AdminUserRow).password_hash?.substring(0, 4))
    
    try {
      const isValidPassword = await bcrypt.compare(password, (admin as AdminUserRow).password_hash)
      console.log("- Password comparison result:", isValidPassword)
      
      if (!isValidPassword) {
        console.error("❌ Password comparison failed")
        throw new Error("Invalid credentials")
      }
    } catch (bcryptError) {
      console.error("❌ bcrypt comparison error:", bcryptError)
      throw new Error("Invalid credentials")
    }

    console.log("📝 Updating last login timestamp...")
    
    // Update last_login (matching your database column name)
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", (admin as AdminUserRow).id)

    if (updateError) {
      console.warn("⚠️ Failed to update last login:", updateError)
    }

    console.log("📝 Logging activity...")
    await this.logActivity(admin.id, "login", undefined, undefined, {
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    console.log("✅ Login successful for user:", admin.username)
    return { user: admin as AdminUserRow }
  }

  async verifyCredentials(username: string, password: string): Promise<AdminUserRow | null> {
    const supabase = this.getSupabaseClient()
    if (!supabase) return null

    console.log("🔍 Verifying credentials for username:", username)

    const { data: admin, error: userError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("is_active", true)
      .single()

    if (userError || !admin) {
      console.log("❌ User not found or database error:", userError)
      return null
    }

    try {
      const isValidPassword = await bcrypt.compare(password, (admin as AdminUserRow).password_hash)
      console.log("🔐 Password verification result:", isValidPassword)
      
      if (!isValidPassword) return null
      
      return admin as AdminUserRow
    } catch (bcryptError) {
      console.error("❌ bcrypt verification error:", bcryptError)
      return null
    }
  }

  async logActivity(
    adminId: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: any,
  ) {
    const supabase = this.getSupabaseClient()
    if (!supabase) return

    try {
      await supabase
        .from("admin_activity_logs")
        .insert([
          {
            admin_id: adminId,
            action,
            resource_type: resourceType,
            resource_id: resourceId,
            details,
          } as AdminActivityLogRow,
        ])
      console.log("📝 Activity logged:", { adminId, action })
    } catch (error) {
      console.error("❌ Failed to log activity:", error)
    }
  }

  async getActivityLogs(adminId?: string, limit = 50, offset = 0) {
    const supabase = this.getSupabaseClient()
    if (!supabase) return { data: [], count: 0 }

    let query = supabase
      .from("admin_activity_logs")
      .select(
        `
        *,
        admin_users (username, email)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (adminId) query = query.eq("admin_id", adminId)

    const { data, error, count } = await query
    if (error) throw error

    return { data: (data as AdminActivityLogRow[]) || [], count: count || 0 }
  }

  // Helper method to create a new password hash
  async createPasswordHash(password: string, saltRounds: number = 12): Promise<string> {
    return await bcrypt.hash(password, saltRounds)
  }

  // Helper method to test a password against a hash (useful for debugging)
  async testPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash)
    } catch (error) {
      console.error("Error testing password:", error)
      return false
    }
  }
}

export const adminAuth = new AdminAuthService()