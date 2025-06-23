import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Listing from '@/models/postModel';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.number().optional(),
  display_price: z.number().optional(),
  discount_price: z.number().optional(),
  top_selling: z.boolean().optional(),
  clearance_sale: z.boolean().optional(),
  status: z.boolean().optional(),
  category: z.string(),
});

// POST: Create a new listing
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();
    const doc = await Listing.create(data);

    return NextResponse.json(doc, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// GET: Get all listings
export async function GET() {
  try {
    await connectDB();
    const listings = await Listing.find().sort({ createdAt: -1 });
    return NextResponse.json(listings);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}