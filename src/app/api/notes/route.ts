import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/lib/models/Note';
import User from '@/lib/models/User';

// GET all notes for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuthToken(request);
    if (!auth?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Find user by email to get their ID
    const user = await User.findOne({ email: auth.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all notes for this user
    const notes = await Note.find({ userId: user._id.toString() })
      .sort({ createdAt: -1 }) // Most recent first
      .select('-__v');

    return NextResponse.json({
      success: true,
      notes: notes.map(note => ({
        id: note._id.toString(),
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST create a new note
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuthToken(request);
    if (!auth?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Find user by email to get their ID
    const user = await User.findOne({ email: auth.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new note
    const note = await Note.create({
      title,
      content,
      userId: user._id.toString(),
    });

    return NextResponse.json({
      success: true,
      note: {
        id: note._id.toString(),
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

