import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with the provided API key
const genAI = new GoogleGenerativeAI('AIzaSyBkbxM3kCE0cudMlI1yqWJ-x3b8Ufxr9fA');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateAIResponse(messages, modelName = 'gemini-1.5-flash') {
  try {
    const systemPrompt = `You are RoboAnalyzer, an intelligent AI assistant that helps users with various tasks including data analysis, coding, general questions, and problem-solving. You are knowledgeable, helpful, and provide clear, concise responses. Always be professional but friendly in your interactions.

Key characteristics:
- Provide accurate and helpful information
- Break down complex topics into understandable parts
- Offer practical solutions and suggestions
- Be concise but comprehensive
- Use examples when helpful
- Ask clarifying questions when needed`;

    // Format messages for Gemini
    let conversationHistory = systemPrompt + '\n\n';
    
    messages.forEach(message => {
      if (message.role === 'user') {
        conversationHistory += `Human: ${message.content}\n\n`;
      } else if (message.role === 'assistant') {
        conversationHistory += `Assistant: ${message.content}\n\n`;
      }
    });

    const result = await model.generateContent(conversationHistory);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      response: text,
      usage: {
        prompt_tokens: conversationHistory.length,
        completion_tokens: text.length,
        total_tokens: conversationHistory.length + text.length
      }
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate AI response'
    };
  }
}

export async function generateChatTitle(messages) {
  try {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (!firstUserMessage) {
      return 'New Chat';
    }

    const prompt = `Generate a short, descriptive title (max 6 words) for a chat that starts with this message: "${firstUserMessage.content}". Only return the title, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const title = response.text().trim().replace(/['"]/g, '');

    return title || 'New Chat';
  } catch (error) {
    console.error('Title generation error:', error);
    return 'New Chat';
  }
}
