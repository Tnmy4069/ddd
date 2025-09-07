import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import ChatHistory from '@/models/ChatHistory';
import Message from '@/models/Message';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

async function handler(request) {
  try {
    const user = request.user;
    await connectDB();

    // Get user's chat statistics
    const totalChats = await ChatHistory.countDocuments({
      user: user._id,
      isActive: true
    });

    // Get total messages from user's chats
    const userChats = await ChatHistory.find({
      user: user._id,
      isActive: true
    }).select('messages');

    const totalMessages = userChats.reduce((total, chat) => {
      return total + chat.messages.length;
    }, 0);

    // Get recent activity (chats updated in last 24 hours)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = await ChatHistory.countDocuments({
      user: user._id,
      isActive: true,
      updatedAt: { $gte: dayAgo }
    });

    // Admin-only stats
    let adminStats = {};
    if (user.role === 'admin') {
      const totalUsers = await User.countDocuments();
      const totalCommunityMessages = await Message.countDocuments();
      const activeUsers = await User.countDocuments({
        lastActive: { $gte: dayAgo }
      });

      adminStats = {
        totalUsers,
        totalCommunityMessages,
        activeUsers,
        systemUptime: process.uptime()
      };
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalChats,
        totalMessages,
        recentActivity,
        ...adminStats
      }
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
