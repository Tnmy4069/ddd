import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import Message from '@/models/Message';
import connectDB from '@/lib/mongodb';

// Update message (admin only)
async function putHandler(request, { params }) {
  try {
    const { messageId } = params;
    const { content } = await request.json();
    const user = request.user;

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

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

    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Update message
    message.content = content.trim();
    message.edited = true;
    message.editedAt = new Date();
    
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

    return NextResponse.json({ message: formattedMessage });
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete message (admin only)
async function deleteHandler(request, { params }) {
  try {
    const { messageId } = params;
    const user = request.user;

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    await Message.findByIdAndDelete(messageId);

    return NextResponse.json(
      { message: 'Message deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler);
