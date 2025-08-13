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
  const { data, error } = await supabase.from('pages').select('*').order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    if (!checkAdmin(req as unknown as Request)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    // expect { id, title, content }
    const { id, title, content } = body;
    if (!id) return NextResponse.json({ error: 'id is required (slug like "hero", "about")' }, { status: 400 });
    const { data, error } = await supabase.from('pages').upsert([{ id, title, content }], { onConflict: 'id' }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
