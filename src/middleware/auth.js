import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function authenticateUser(request) {
  try {
    // Get token from Authorization header
    const token = getTokenFromHeaders(request.headers);
    
    if (!token) {
      return { success: false, error: 'No token provided' };
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return { success: false, error: 'Invalid token' };
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export function withAuth(handler) {
  return async function(request, context) {
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      return Response.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    // Add user to request context
    request.user = authResult.user;
    
    return handler(request, context);
  };
}
