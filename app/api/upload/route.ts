// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // The request body should be the file itself
  if (filename && request.body) {
    const blob = await put(filename, request.body, {
      access: 'public',
      addRandomSuffix: true
    });
    return NextResponse.json(blob);
  }
  
  return NextResponse.json({ message: 'No filename provided' }, { status: 400 });
}