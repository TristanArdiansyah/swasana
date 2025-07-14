import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const storiesFilePath = path.join(process.cwd(), 'data/stories.json');

async function getStories() {
  const storiesData = await fs.readFile(storiesFilePath, 'utf-8');
  return JSON.parse(storiesData);
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();  // Extract the ID from the URL

    const updatedStory = await request.json();
    const stories = await getStories();
    const storyIndex = stories.findIndex((story: { id: number }) => story.id === parseInt(id!, 10));

    if (storyIndex === -1) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    stories[storyIndex] = { ...stories[storyIndex], ...updatedStory };
    await fs.writeFile(storiesFilePath, JSON.stringify(stories, null, 2));

    return NextResponse.json({ message: 'Story updated successfully', story: stories[storyIndex] });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating story', error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();  // Extract the ID from the URL

    let stories = await getStories();
    const storyExists = stories.some((story: { id: number }) => story.id === parseInt(id!, 10));

    if (!storyExists) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    const updatedStories = stories.filter((story: { id: number }) => story.id !== parseInt(id!, 10));
    await fs.writeFile(storiesFilePath, JSON.stringify(updatedStories, null, 2));

    return NextResponse.json({ message: 'Story deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting story', error }, { status: 500 });
  }
}
