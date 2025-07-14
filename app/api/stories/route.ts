import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const storiesFilePath = path.join(process.cwd(), 'data/stories.json');

// GET all stories
export async function GET() {
  try {
    const storiesData = await fs.readFile(storiesFilePath, 'utf-8');
    const stories = JSON.parse(storiesData);
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching stories', error }, { status: 500 });
  }
}

// POST a new story
export async function POST(request: Request) {
  try {
    const newStory = await request.json();
    const storiesData = await fs.readFile(storiesFilePath, 'utf-8');
    const stories = JSON.parse(storiesData);

    stories.push(newStory);

    await fs.writeFile(storiesFilePath, JSON.stringify(stories, null, 2));

    return NextResponse.json({ message: 'Story added successfully', story: newStory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding story', error }, { status: 500 });
  }
}