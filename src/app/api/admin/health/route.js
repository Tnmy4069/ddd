import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

export async function GET(request) {
  try {
    // Check authentication
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await connectDB();
    
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Check system health
    const health = {
      database: 'healthy',
      api: 'healthy',
      ai: 'healthy',
      timestamp: new Date().toISOString()
    };

    // Test database connection
    try {
      await User.findOne().limit(1);
      health.database = 'healthy';
    } catch (error) {
      console.error('Database health check failed:', error);
      health.database = 'error';
    }

    // Test AI service (could be expanded to actually test Gemini API)
    try {
      // For now, assume AI is healthy if we can import the module
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      health.ai = 'healthy';
    } catch (error) {
      console.error('AI service health check failed:', error);
      health.ai = 'error';
    }

    return NextResponse.json({
      success: true,
      health
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { error: 'Failed to check system health' },
      { status: 500 }
    );
  }
}
