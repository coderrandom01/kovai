// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  const blob = await put(file.name, file, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN, // Optional if set in env
});

  return new Response(JSON.stringify({ url: blob.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
