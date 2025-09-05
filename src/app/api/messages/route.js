import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import Message from '@/models/Message';
import connectDB from '@/lib/mongodb';

async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const room = searchParams.get('room') || 'general';
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = parseInt(searchParams.get('skip')) || 0;

    await connectDB();

    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'username avatar isOnline')
      .lean();

    // Reverse to get chronological order
    const formattedMessages = messages.reverse().map(message => ({
      id: message._id,
      content: message.content,
      username: message.username,
      user: message.user,
      room: message.room,
      type: message.type,
      edited: message.edited,
      editedAt: message.editedAt,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function postHandler(request) {
  try {
    const { content, room = 'general', type = 'text' } = await request.json();
    const user = request.user;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Message cannot exceed 1000 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const message = new Message({
      user: user._id,
      username: user.username,
      content: content.trim(),
      room,
      type
    });

    await message.save();
    await message.populate('user', 'username avatar isOnline');

    const formattedMessage = {
      id: message._id,
      content: message.content,
      username: message.username,
      user: message.user,
      room: message.room,
      type: message.type,
      edited: message.edited,
      editedAt: message.editedAt,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };

    return NextResponse.json(
      { message: formattedMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error('Post message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
