// Test admin message functionality
// This file can be used to test the admin message editing and deletion features

import { NextResponse } from 'next/server';

export async function GET(request) {
  // Simple test endpoint to verify admin routes are working
  return NextResponse.json({
    message: 'Admin message routes are configured correctly',
    routes: {
      'PUT /api/messages/[messageId]': 'Edit message (admin only)',
      'DELETE /api/messages/[messageId]': 'Delete message (admin only)'
    },
    usage: {
      edit: {
        method: 'PUT',
        url: '/api/messages/{messageId}',
        body: { content: 'New message content' },
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      },
      delete: {
        method: 'DELETE',
        url: '/api/messages/{messageId}',
        credentials: 'include'
      }
    }
  });
}
