import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { username, email, password, adminSecret } = await request.json();
    
    // Admin secret key for security
    const ADMIN_SECRET = "RoboAnalyzer_Admin_2024";
    
    if (adminSecret !== ADMIN_SECRET) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid admin secret key' 
      }, { status: 403 });
    }

    await connectDB();

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin user already exists. Only one admin allowed.' 
      }, { status: 400 });
    }

    // Check if user with email or username already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User with this email or username already exists' 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create admin user
    const adminUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      avatar: '/avatar.svg',
      isOnline: false,
      lastSeen: new Date()
    });

    await adminUser.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully! You can now login.',
      user: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('Admin creation error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email or username already exists' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create admin user' 
    }, { status: 500 });
  }
}
