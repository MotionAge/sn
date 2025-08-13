import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

function checkAdmin(req: Request) {
  const key = (req.headers.get('x-admin-key') || req.headers.get('authorization')) || '';
  if (!ADMIN_API_KEY || key !== ADMIN_API_KEY) {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!checkAdmin(req as unknown as Request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { title, description, image_url, cta_text, cta_url, order_index, is_active } = body;
    
    // Validate required fields
    if (!title || !description || !image_url || !cta_text || !cta_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('hero_slides')
      .insert([{ 
        title, 
        description, 
        image_url, 
        cta_text, 
        cta_url, 
        order_index: order_index || 0,
        is_active: is_active !== undefined ? is_active : true 
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 400 });
  }
}
