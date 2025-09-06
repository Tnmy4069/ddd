import OpenAI from 'openai';

// Initialize OpenAI only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function generateAIResponse(messages, model = 'gpt-3.5-turbo') {
  try {
    if (!process.env.OPENAI_API_KEY || !openai) {
      throw new Error('OpenAI API key not configured. Please add your OPENAI_API_KEY to the environment variables.');
    }

    const systemPrompt = {
      role: 'system',
      content: `You are RoboAnalyzer, an intelligent AI assistant that helps users with various tasks including data analysis, coding, general questions, and problem-solving. You are knowledgeable, helpful, and provide clear, concise responses. Always be professional but friendly in your interactions.

Key characteristics:
- Provide accurate and helpful information
- Break down complex topics into understandable parts
- Offer practical solutions and suggestions
- Be concise but comprehensive
- Use examples when helpful
- Ask clarifying questions when needed`
    };

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [systemPrompt, ...messages],
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    return {
      success: true,
      response: completion.choices[0].message.content,
      usage: completion.usage
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate AI response'
    };
  }
}

export async function generateChatTitle(messages) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return 'New Chat';
    }

    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (!firstUserMessage) {
      return 'New Chat';
    }

    const prompt = `Generate a short, descriptive title (max 6 words) for a chat that starts with this message: "${firstUserMessage.content}". Only return the title, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 20,
      temperature: 0.5,
    });

    return completion.choices[0].message.content.trim().replace(/['"]/g, '');
  } catch (error) {
    console.error('Title generation error:', error);
    return 'New Chat';
  }
}
