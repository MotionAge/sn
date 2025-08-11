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
  // return latest 100 donations by default
  const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    // Allow creating donation records without admin key (clients will POST after payment)
    const body = await req.json();
    // expected fields: donor_name, email, amount, currency, project_id (nullable), message
    const { donor_name, email, amount, currency = 'USD', project_id = null, message = '' } = body;
    if (!donor_name || !amount) return NextResponse.json({ error: 'donor_name and amount are required' }, { status: 400 });

    const insertObj = { donor_name, email, amount, currency, project_id, message };
    const { data, error } = await supabase.from('donations').insert([insertObj]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Optionally: trigger post-processing, webhooks, or update project totals here

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
