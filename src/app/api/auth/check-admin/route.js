import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const adminExists = await User.findOne({ role: 'admin' });
    
    return NextResponse.json({
      success: true,
      adminExists: !!adminExists
    });

  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check admin status' 
    }, { status: 500 });
  }
}
