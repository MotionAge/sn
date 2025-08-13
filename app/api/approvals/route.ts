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
    // Fetch pending approvals from multiple tables
    const [memberships, donations, eventRegistrations] = await Promise.all([
      supabase
        .from('membership')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false }),
      supabase
        .from('donations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false }),
      supabase
        .from('event_registrations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
    ]);

    // Transform data to unified format
    const approvals = [
      ...(memberships.data || []).map((item: any) => ({
        id: item.id,
        type: 'membership',
        applicant_name: item.full_name,
        email: item.email,
        phone: item.phone,
        amount: item.payment_amount,
        currency: 'NPR',
        payment_method: item.payment_method,
        transaction_id: item.transaction_id,
        applied_date: item.created_at,
        status: item.status,
        documents: item.documents || [],
        address: item.address
      })),
      ...(donations.data || []).map((item: any) => ({
        id: item.id,
        type: 'donation',
        applicant_name: item.donor_name,
        email: item.donor_email,
        phone: item.donor_phone,
        amount: item.amount,
        currency: item.currency,
        payment_method: item.payment_method,
        transaction_id: item.transaction_id,
        applied_date: item.created_at,
        status: item.status,
        purpose: item.purpose,
        receipt_requested: item.receipt_requested
      })),
      ...(eventRegistrations.data || []).map((item: any) => ({
        id: item.id,
        type: 'event_registration',
        applicant_name: item.participant_name,
        email: item.participant_email,
        phone: item.participant_phone,
        amount: item.registration_fee,
        currency: 'NPR',
        payment_method: item.payment_method,
        transaction_id: item.transaction_id,
        applied_date: item.created_at,
        status: item.status,
        event_title: item.event_title,
        event_date: item.event_date
      }))
    ];

    return NextResponse.json(approvals);
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
