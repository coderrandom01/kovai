import { connectDB } from '@/lib/mongoose';
import { NextResponse } from 'next/server';
import CategoryModel from '@/models/categoryModel';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await request.json();
  const { name, parent, status, image } = body;

  const updated = await CategoryModel.findByIdAndUpdate(
    params.id,
    { name, parent: parent || null, status, image },
    { new: true }
  );

  return NextResponse.json(updated);
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const deleted = await CategoryModel.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

  return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
}
