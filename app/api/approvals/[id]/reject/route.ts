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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!checkAdmin(req as unknown as Request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type } = body;
    const { id } = params;

    let result;
    const now = new Date().toISOString();

    switch (type) {
      case 'membership':
        result = await supabase
          .from('membership')
          .update({ 
            status: 'rejected', 
            rejected_by: 'admin',
            rejected_date: now,
            updated_at: now
          })
          .eq('id', id)
          .select()
          .single();
        break;

      case 'donation':
        result = await supabase
          .from('donations')
          .update({ 
            status: 'rejected', 
            rejected_by: 'admin',
            rejected_date: now,
            updated_at: now
          })
          .eq('id', id)
          .select()
          .single();
        break;

      case 'event_registration':
        result = await supabase
          .from('event_registrations')
          .update({ 
            status: 'rejected', 
            rejected_by: 'admin',
            rejected_date: now,
            updated_at: now
          })
          .eq('id', id)
          .select()
          .single();
        break;

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (result.error) {
      console.error('Supabase error:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
