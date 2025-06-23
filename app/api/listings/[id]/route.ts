// app/api/listings/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Listing from '@/models/postModel';
import { z } from 'zod';
import mongoose from 'mongoose';

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.number().optional(),
  display_price: z.number().optional(),
  discount_price: z.number().optional(),
  top_selling: z.boolean().optional(),
  clearance_sale: z.boolean().optional(),
  category: z.string(), // required category ID
status: z.boolean().optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const listing = await Listing.findById(params.id);
    if (!listing) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(listing);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data : any = schema.parse(body);
    data.category = new mongoose.Types.ObjectId(data.category)
    await connectDB();
    const updated = await Listing.findByIdAndUpdate(params.id, data, { new: true });
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Listing.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
