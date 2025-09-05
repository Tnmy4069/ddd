'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Import the main chat component logic
import ChatPage from '../page';

export default function SpecificChatPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [chatData, setChatData] = useState(null);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/chat/${params.chatId}`);
        setChatData(response.data);
      } catch (error) {
        console.error('Error loading chat:', error);
        toast.error('Failed to load chat');
        router.push('/chat');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.chatId) {
      loadChatData();
    }
  }, [params.chatId, router]);

  // Remove the separate loadChatData function

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="loading-spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Chat not found</p>
          <button 
            onClick={() => router.push('/chat')}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back to chat
          </button>
        </div>
      </div>
    );
  }

  // Pass the chat data to the main chat component
  return <ChatPage initialChatData={chatData} />;
}
