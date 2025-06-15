import { put } from '@vercel/blob';
import { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File;

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file found' }), { status: 400 });
  }

  // Add a unique ID to avoid overwriting
  const extension = file.name.split('.').pop();
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const uniqueName = `${baseName}-${Date.now()}-${nanoid()}.${extension}`;

  const blob = await put(uniqueName, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN, // optional if set in env
  });

  return new Response(JSON.stringify({ url: blob.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
