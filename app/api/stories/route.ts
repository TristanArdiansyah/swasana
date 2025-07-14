import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all stories
export async function GET() {
  const { data: stories, error } = await supabase.from('poems').select('*');

  if (error) {
    return NextResponse.json({ message: 'Error fetching stories', error }, { status: 500 });
  }

  return NextResponse.json(stories);
}

// POST a new story
export async function POST(request: Request) {
  const newStory = await request.json();

  const { data, error } = await supabase.from('poems').insert([newStory]).select().single();

  if (error) {
    return NextResponse.json({ message: 'Error adding story', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Story added successfully', story: data }, { status: 201 });
}
