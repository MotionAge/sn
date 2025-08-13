import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Try to find the item in different tables
    const [membership, certificate, donation, receipt] = await Promise.all([
      // Check membership table
      supabase
        .from('membership')
        .select('*')
        .or(`member_id.eq.${query},id.eq.${query}`)
        .single(),
      
      // Check certificates table
      supabase
        .from('certificates')
        .select('*')
        .or(`certificate_number.eq.${query},id.eq.${query}`)
        .single(),
      
      // Check donations table
      supabase
        .from('donations')
        .select('*')
        .or(`id.eq.${query}`)
        .single(),
      
      // Check receipts table (if separate)
      supabase
        .from('receipts')
        .select('*')
        .or(`receipt_number.eq.${query},id.eq.${query}`)
        .single()
    ]);

    // Return the first found result
    if (membership.data) {
      return NextResponse.json({
        type: 'membership',
        id: membership.data.member_id || membership.data.id,
        name: membership.data.full_name,
        status: membership.data.status,
        issue_date: membership.data.join_date,
        expiry_date: membership.data.expiry_date,
        certificate_number: membership.data.certificate_number
      });
    }

    if (certificate.data) {
      return NextResponse.json({
        type: 'certificate',
        id: certificate.data.id,
        name: certificate.data.recipient_name,
        status: certificate.data.status,
        issue_date: certificate.data.issued_date,
        valid_until: certificate.data.valid_until,
        certificate_number: certificate.data.certificate_number,
        verification_code: certificate.data.verification_code
      });
    }

    if (donation.data) {
      return NextResponse.json({
        type: 'donation',
        id: donation.data.id,
        name: donation.data.donor_name,
        status: donation.data.status,
        issue_date: donation.data.created_at,
        amount: donation.data.amount,
        currency: donation.data.currency,
        purpose: donation.data.purpose
      });
    }

    if (receipt.data) {
      return NextResponse.json({
        type: 'receipt',
        id: receipt.data.id,
        name: receipt.data.donor_name,
        status: receipt.data.status,
        issue_date: receipt.data.created_at,
        receipt_number: receipt.data.receipt_number,
        amount: receipt.data.amount,
        currency: receipt.data.currency,
        purpose: receipt.data.purpose
      });
    }

    // If no results found
    return NextResponse.json({ error: 'No records found for the provided query' }, { status: 404 });

  } catch (err) {
    console.error('Verification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
