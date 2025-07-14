import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request ) {
  const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
  const updatedStory = await request.json();

  const { data, error } = await supabase
    .from('poems')
    .update(updatedStory)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: 'Error updating story', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Story updated successfully', story: data });
}

export async function DELETE(request: Request ) {
  const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

  const { error } = await supabase
    .from('poems')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ message: 'Error deleting story', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Story deleted successfully' });
}
