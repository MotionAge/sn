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

export async function GET() {
  const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// simple server-side upload: expects { filename, base64 } where base64 is data URL or base64 string
export async function POST(req: NextRequest) {
  try {
    if (!checkAdmin(req as unknown as Request)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { filename, base64, caption = '' } = body;
    if (!filename || !base64) return NextResponse.json({ error: 'filename and base64 are required' }, { status: 400 });

    // normalize base64 (remove data url prefix)
    const match = (base64 as string).match(/data:(.*);base64,(.*)$/);
    let b64data = base64 as string;
    let contentType = undefined;
    if (match) {
      contentType = match[1];
      b64data = match[2];
    }

    const buffer = Buffer.from(b64data, 'base64');
    const { data: uploadData, error: uploadError } = await supabase.storage.from(BUCKET).upload(filename, buffer, { contentType, upsert: true });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    // create public URL
    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);

    const { data, error } = await supabase.from('gallery').insert([{ image_url: publicData.publicUrl, caption }]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
