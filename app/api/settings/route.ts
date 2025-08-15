import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: settings, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("category", { ascending: true })

    if (error) {
      console.error("Error fetching settings:", error)
      return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }

    // Convert array to object grouped by category
    const settingsObject: Record<string, Record<string, any>> = {}
    settings.forEach((setting) => {
      if (!settingsObject[setting.category]) {
        settingsObject[setting.category] = {}
      }
      settingsObject[setting.category][setting.key] = setting.value
    })

    return NextResponse.json(settingsObject)
  } catch (error) {
    console.error("Error in settings GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Update multiple settings
    const updates = []
    for (const [category, settings] of Object.entries(body)) {
      for (const [key, value] of Object.entries(settings as Record<string, any>)) {
        updates.push({
          category,
          key,
          value,
          updated_at: new Date().toISOString(),
        })
      }
    }

    // Use upsert to insert or update settings
    const { data, error } = await supabase
      .from("site_settings")
      .upsert(updates, {
        onConflict: "category,key",
        ignoreDuplicates: false,
      })
      .select()

    if (error) {
      console.error("Error updating settings:", error)
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    return NextResponse.json({ message: "Settings updated successfully", data })
  } catch (error) {
    console.error("Error in settings PUT:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
