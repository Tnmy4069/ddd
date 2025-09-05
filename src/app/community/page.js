'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Send, 
  Home, 
  Hash,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { formatTime } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CommunityPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const rooms = [
    { id: 'general', name: 'General', icon: MessageCircle, description: 'General discussion' },
    { id: 'ai-chat', name: 'AI & ML', icon: Hash, description: 'AI and Machine Learning' },
    { id: 'data-science', name: 'Data Science', icon: Hash, description: 'Data analysis & visualization' },
    { id: 'tech-talk', name: 'Tech Talk', icon: Hash, description: 'Technology discussions' },
    { id: 'help', name: 'Help & Support', icon: Hash, description: 'Get help from community' }
  ];

  // Load messages when room changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/messages?room=${currentRoom}&limit=50`);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [currentRoom, user]);

  // Simple auto-refresh every 5 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/messages?room=${currentRoom}&limit=50`);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error refreshing messages:', error);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentRoom, user]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoomChange = (roomId) => {
    if (roomId !== currentRoom) {
      setCurrentRoom(roomId);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/messages?room=${currentRoom}&limit=50`);
      setMessages(response.data.messages || []);
      toast.success('Messages refreshed!');
    } catch (error) {
      console.error('Error refreshing messages:', error);
      toast.error('Failed to refresh messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !user || isSending) return;
    
    try {
      setIsSending(true);
      
      await axios.post('/api/messages', {
        content: inputMessage,
        room: currentRoom,
        type: 'text'
      });
      
      setInputMessage('');
      
      // Refresh messages to show the new message
      const response = await axios.get(`/api/messages?room=${currentRoom}&limit=50`);
      setMessages(response.data.messages || []);
      
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Join the Community</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please log in to participate in community discussions.
            </p>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentRoomData = rooms.find(room => room.id === currentRoom);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <span className="text-gray-300">/</span>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">Community Chat</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar - Rooms */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Hash className="h-5 w-5" />
                  <span>Chat Rooms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {rooms.map((room) => (
                  <motion.button
                    key={room.id}
                    onClick={() => handleRoomChange(room.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentRoom === room.id
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <room.icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{room.name}</div>
                        <div className="text-sm text-gray-500">{room.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {currentRoomData?.icon && <currentRoomData.icon className="h-6 w-6 text-blue-600" />}
                    <div>
                      <CardTitle className="text-xl">{currentRoomData?.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {currentRoomData?.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="loading-spinner h-6 w-6"></div>
                      <span className="ml-2">Loading messages...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={message._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender._id === user._id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}>
                            {message.sender._id !== user._id && (
                              <div className="text-xs font-medium mb-1 opacity-75">
                                {message.sender.username}
                              </div>
                            )}
                            <div className="text-sm">{message.content}</div>
                            <div className={`text-xs mt-1 opacity-75 ${
                              message.sender._id === user._id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp || message.createdAt)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Message #${currentRoomData?.name.toLowerCase()}`}
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button 
                    type="submit" 
                    disabled={!inputMessage.trim() || isSending}
                    size="sm"
                  >
                    {isSending ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
