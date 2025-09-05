import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { generateAIResponse, generateChatTitle } from '@/lib/openai';
import ChatHistory from '@/models/ChatHistory';
import connectDB from '@/lib/mongodb';

async function handler(request) {
  try {
    const { messages, chatId, model } = await request.json();
    const user = request.user;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate AI response
    const aiResult = await generateAIResponse(messages, model);
    
    if (!aiResult.success) {
      return NextResponse.json(
        { error: aiResult.error },
        { status: 500 }
      );
    }

    const assistantMessage = {
      role: 'assistant',
      content: aiResult.response,
      timestamp: new Date()
    };

    // Save or update chat history
    let chatHistory;
    
    if (chatId) {
      // Update existing chat
      chatHistory = await ChatHistory.findOneAndUpdate(
        { _id: chatId, user: user._id },
        {
          $push: {
            messages: {
              $each: [
                ...messages.map(msg => ({ ...msg, timestamp: new Date() })),
                assistantMessage
              ]
            }
          }
        },
        { new: true }
      );
    } else {
      // Create new chat
      const title = await generateChatTitle(messages);
      
      chatHistory = new ChatHistory({
        user: user._id,
        title,
        messages: [
          ...messages.map(msg => ({ ...msg, timestamp: new Date() })),
          assistantMessage
        ],
        model: model || 'gpt-3.5-turbo'
      });
      
      await chatHistory.save();
    }

    return NextResponse.json({
      response: aiResult.response,
      chatId: chatHistory._id,
      title: chatHistory.title,
      usage: aiResult.usage
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);
