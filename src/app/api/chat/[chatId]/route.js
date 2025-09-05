import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import ChatHistory from '@/models/ChatHistory';
import connectDB from '@/lib/mongodb';

async function handler(request, { params }) {
  try {
    const { chatId } = params;
    const user = request.user;

    await connectDB();

    const chatHistory = await ChatHistory.findOne({
      _id: chatId,
      user: user._id,
      isActive: true
    });

    if (!chatHistory) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: chatHistory._id,
      title: chatHistory.title,
      messages: chatHistory.messages,
      model: chatHistory.model,
      createdAt: chatHistory.createdAt,
      updatedAt: chatHistory.updatedAt
    });
  } catch (error) {
    console.error('Get single chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
