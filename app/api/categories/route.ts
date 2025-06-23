// import { connectDB } from '@/lib/db';
// import Category from '@/models/Category';
import Category from "@/models/categoryModel";

import { connectDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const categories = await Category.find().populate('parent');
  return NextResponse.json(categories);
}

// POST /api/categories
export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const { name, parent, status, image } = body;

  const newCategory = await Category.create({
    name,
    parent: parent || null,
    status: status ?? true,
    image,
  });

  return NextResponse.json(newCategory, { status: 201 });
}

