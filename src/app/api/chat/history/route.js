import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import ChatHistory from '@/models/ChatHistory';
import connectDB from '@/lib/mongodb';

async function getHandler(request) {
  try {
    const user = request.user;
    await connectDB();

    const chatHistories = await ChatHistory.find({
      user: user._id,
      isActive: true
    })
    .sort({ updatedAt: -1 })
    .select('_id title createdAt updatedAt messages')
    .limit(50);

    const formattedHistories = chatHistories.map(chat => ({
      id: chat._id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messageCount: chat.messages.length,
      lastMessage: chat.messages[chat.messages.length - 1]?.content?.substring(0, 100) || ''
    }));

    return NextResponse.json({ histories: formattedHistories });
  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request) {
  try {
    const { chatId } = await request.json();
    const user = request.user;

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await ChatHistory.findOneAndUpdate(
      { _id: chatId, user: user._id },
      { isActive: false },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
export const DELETE = withAuth(deleteHandler);
