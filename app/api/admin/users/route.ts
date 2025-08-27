import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase"
import bcrypt from "bcrypt" // Changed from bcryptjs to bcrypt

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/admin/users - Fetching admin users")
    
    const currentUser = await adminAuth.getCurrentUser()
    if (!currentUser) {
      console.log("❌ No authenticated user")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("👤 Current user:", { 
      id: currentUser.id, 
      username: currentUser.username, 
      role: currentUser.role 
    })

    // Only super_admin can view all users
    if (currentUser.role !== "super_admin") {
      console.log("❌ Insufficient permissions - role:", currentUser.role)
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const supabase = createClient()
    if (!supabase) {
      console.log("❌ Database connection not available")
      return NextResponse.json({ error: "Database connection not available" }, { status: 503 })
    }

    console.log("📊 Querying admin_users table...")
    
    // Fixed column name: last_login instead of last_login_at to match your database
    const { data: users, error } = await supabase
      .from("admin_users")
      .select("id, username, email, role, is_active, last_login, created_at, updated_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Database query error:", error)
      throw error
    }

    console.log("✅ Successfully fetched", users?.length || 0, "admin users")

    return NextResponse.json({
      success: true,
      data: users || [],
      count: users?.length || 0
    })
  } catch (error) {
    console.error("❌ Get admin users error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch admin users"
    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/admin/users - Creating new admin user")
    
    const currentUser = await adminAuth.getCurrentUser()
    if (!currentUser) {
      console.log("❌ No authenticated user")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("👤 Current user:", { 
      id: currentUser.id, 
      username: currentUser.username, 
      role: currentUser.role 
    })

    // Only super_admin can create users
    if (currentUser.role !== "super_admin") {
      console.log("❌ Insufficient permissions - role:", currentUser.role)
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { username, email, password, role, full_name } = body

    console.log("📝 Request data:", { username, email, role, full_name, passwordProvided: !!password })

    // Validation
    if (!username || !email || !password || !role) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!["super_admin", "admin", "moderator"].includes(role)) {
      console.log("❌ Invalid role:", role)
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Password strength validation (optional)
    if (password.length < 6) {
      console.log("❌ Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      console.log("❌ Database connection not available")
      return NextResponse.json({ error: "Database connection not available" }, { status: 503 })
    }

    console.log("🔐 Hashing password...")
    
    // Hash password with bcrypt
    let passwordHash: string
    try {
      passwordHash = await bcrypt.hash(password, 12)
      console.log("✅ Password hashed successfully")
    } catch (hashError) {
      console.error("❌ Password hashing error:", hashError)
      return NextResponse.json({ error: "Failed to process password" }, { status: 500 })
    }

    console.log("📝 Creating user in database...")
    
    // Prepare user data to match your database schema
    const userData = {
      username,
      email,
      password_hash: passwordHash,
      role,
      full_name: full_name || null, // Include full_name if provided
      is_active: true, // Default to active
    }

    console.log("📊 User data to insert:", { ...userData, password_hash: "[HIDDEN]" })

    // Create user
    const { data: newUser, error } = await supabase
      .from("admin_users")
      .insert(userData)
      .select("id, username, email, full_name, role, is_active, created_at, updated_at")
      .single()

    if (error) {
      console.error("❌ Database insert error:", error)
      
      if (error.code === "23505") {
        // Unique constraint violation
        console.log("❌ Duplicate username or email")
        return NextResponse.json({ error: "Username or email already exists" }, { status: 409 })
      }
      throw error
    }

    console.log("✅ User created successfully:", newUser?.id)

    // Log activity
    try {
      await adminAuth.logActivity(currentUser.id, "create_admin_user", "admin_users", newUser?.id, {
        username,
        email,
        role,
        full_name,
        created_by: currentUser.username
      })
      console.log("✅ Activity logged")
    } catch (logError) {
      console.warn("⚠️ Failed to log activity:", logError)
    }

    return NextResponse.json({
      success: true,
      data: newUser,
      message: "Admin user created successfully"
    })
  } catch (error) {
    console.error("❌ Create admin user error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Failed to create admin user"
    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("🔍 PUT /api/admin/users - Updating admin user")
    
    const currentUser = await adminAuth.getCurrentUser()
    if (!currentUser) {
      console.log("❌ No authenticated user")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Only super_admin can update users (or users can update themselves)
    if (currentUser.role !== "super_admin") {
      console.log("❌ Insufficient permissions - role:", currentUser.role)
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { id, username, email, role, full_name, is_active, password } = body

    console.log("📝 Update request:", { id, username, email, role, full_name, is_active, passwordProvided: !!password })

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 503 })
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (username !== undefined) updateData.username = username
    if (email !== undefined) updateData.email = email
    if (role !== undefined && ["super_admin", "admin", "moderator"].includes(role)) {
      updateData.role = role
    }
    if (full_name !== undefined) updateData.full_name = full_name
    if (is_active !== undefined) updateData.is_active = is_active

    // Handle password update
    if (password && password.length >= 6) {
      console.log("🔐 Updating password...")
      try {
        updateData.password_hash = await bcrypt.hash(password, 12)
        console.log("✅ Password updated and hashed")
      } catch (hashError) {
        console.error("❌ Password hashing error:", hashError)
        return NextResponse.json({ error: "Failed to process password" }, { status: 500 })
      }
    }

    console.log("📝 Updating user in database...")
    
    const { data: updatedUser, error } = await supabase
      .from("admin_users")
      .update(updateData)
      .eq("id", id)
      .select("id, username, email, full_name, role, is_active, last_login, created_at, updated_at")
      .single()

    if (error) {
      console.error("❌ Database update error:", error)
      if (error.code === "23505") {
        return NextResponse.json({ error: "Username or email already exists" }, { status: 409 })
      }
      throw error
    }

    console.log("✅ User updated successfully:", updatedUser?.id)

    // Log activity
    try {
      await adminAuth.logActivity(currentUser.id, "update_admin_user", "admin_users", id, {
        changes: updateData,
        updated_by: currentUser.username
      })
    } catch (logError) {
      console.warn("⚠️ Failed to log activity:", logError)
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Admin user updated successfully"
    })
  } catch (error) {
    console.error("❌ Update admin user error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Failed to update admin user"
    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("🔍 DELETE /api/admin/users - Deleting admin user")
    
    const currentUser = await adminAuth.getCurrentUser()
    if (!currentUser) {
      console.log("❌ No authenticated user")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Only super_admin can delete users
    if (currentUser.role !== "super_admin") {
      console.log("❌ Insufficient permissions - role:", currentUser.role)
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Prevent self-deletion
    if (userId === currentUser.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 503 })
    }

    console.log("🗑️ Deleting user:", userId)

    // Get user info before deletion for logging
    const { data: userToDelete } = await supabase
      .from("admin_users")
      .select("username, email")
      .eq("id", userId)
      .single()

    // Delete user
    const { error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", userId)

    if (error) {
      console.error("❌ Database delete error:", error)
      throw error
    }

    console.log("✅ User deleted successfully:", userId)

    // Log activity
    try {
      await adminAuth.logActivity(currentUser.id, "delete_admin_user", "admin_users", userId, {
        deleted_user: userToDelete,
        deleted_by: currentUser.username
      })
    } catch (logError) {
      console.warn("⚠️ Failed to log activity:", logError)
    }

    return NextResponse.json({
      success: true,
      message: "Admin user deleted successfully"
    })
  } catch (error) {
    console.error("❌ Delete admin user error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Failed to delete admin user"
    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}