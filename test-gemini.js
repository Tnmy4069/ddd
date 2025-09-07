// Test script for Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGemini() {
  try {
    console.log('🧪 Testing Gemini API integration...');
    
    const genAI = new GoogleGenerativeAI('AIzaSyBkbxM3kCE0cudMlI1yqWJ-x3b8Ufxr9fA');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = "Hello! Please respond with 'Gemini AI is working correctly!' if you can read this.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API Response:', text);
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testGemini();
