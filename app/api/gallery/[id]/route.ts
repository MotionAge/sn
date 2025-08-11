import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = process.env.SUPABASE_GALLERY_BUCKET || 'gallery';

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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!checkAdmin(req as unknown as Request)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const id = params.id;
    // find image record
    const { data: record, error: findError } = await supabase.from('gallery').select('*').eq('id', id).single();
    if (findError) return NextResponse.json({ error: findError.message }, { status: 404 });
    // try to delete storage object by parsing path from URL
    const url = record.image_url as string;
    const pathMatch = url.match(/\/storage\/v1\/object\/public\/(?:[^\/]+)\/(.*)$/);
    if (pathMatch && pathMatch[1]) {
      const path = decodeURIComponent(pathMatch[1]);
      await supabase.storage.from(BUCKET).remove([path]);
    }
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
