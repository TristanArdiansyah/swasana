import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const storiesFilePath = path.join(process.cwd(), 'data/stories.json');

// Helper function to read stories
async function getStories() {
  const storiesData = await fs.readFile(storiesFilePath, 'utf-8');
  return JSON.parse(storiesData);
}

// PUT (update) a story
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedStory = await request.json();
    const stories = await getStories();
    const storyIndex = stories.findIndex((story: { id: number }) => story.id === parseInt(params.id, 10));

    if (storyIndex === -1) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    stories[storyIndex] = { ...stories[storyIndex], ...updatedStory };
    await fs.writeFile(storiesFilePath, JSON.stringify(stories, null, 2));

    return NextResponse.json({ message: 'Story updated successfully', story: stories[storyIndex] });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Error updating story' }, { status: 500 });
  }
}

// DELETE a story
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const stories = await getStories();
    const idToDelete = parseInt(params.id, 10);
    const storyExists = stories.some((story: { id: number }) => story.id === idToDelete);

    if (!storyExists) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    const updatedStories = stories.filter((story: { id: number }) => story.id !== idToDelete);
    await fs.writeFile(storiesFilePath, JSON.stringify(updatedStories, null, 2));

    return NextResponse.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Error deleting story' }, { status: 500 });
  }
}
