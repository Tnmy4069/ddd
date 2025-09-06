import { getUserFromCookie } from '@/lib/auth';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function authenticateUser(request) {
  try {
    // Get user ID from cookie
    const userId = await getUserFromCookie();
    
    console.log('Auth middleware - userId from cookie:', userId);
    
    if (!userId) {
      console.log('Auth middleware - No user ID in cookie');
      return { success: false, error: 'No authentication cookie' };
    }

    // Connect to database
    await connectDB();
    console.log('Auth middleware - DB connected');

    // Find user
    const user = await User.findById(userId).select('-password');
    console.log('Auth middleware - user found:', !!user, user?.username);
    
    if (!user) {
      console.log('Auth middleware - User not found for ID:', userId);
      return { success: false, error: 'User not found' };
    }

    console.log('Auth middleware - Authentication successful for user:', user.username);
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
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Add user to request context
    request.user = authResult.user;
    
    return handler(request, context);
  };
}
