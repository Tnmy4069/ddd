'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Send, 
  Home, 
  Hash,
  Settings,
  UserCheck,
  Clock,
  MessageCircle,
  Plus,
  Search
} from 'lucide-react';
import { formatTime, formatDateTime } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CommunityPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const rooms = [
    { id: 'general', name: 'General', icon: MessageCircle, description: 'General discussion' },
    { id: 'ai-chat', name: 'AI & ML', icon: Hash, description: 'AI and Machine Learning' },
    { id: 'data-science', name: 'Data Science', icon: Hash, description: 'Data analysis & visualization' },
    { id: 'tech-talk', name: 'Tech Talk', icon: Hash, description: 'Technology discussions' },
    { id: 'help', name: 'Help & Support', icon: Hash, description: 'Get help from community' }
  ];

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages?room=${currentRoom}&limit=50`);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
    // TODO: Initialize Socket.io connection here
    setIsConnected(true);
    
    // Simulate some online users for now
    setOnlineUsers([
      { id: '1', username: 'alex_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', isOnline: true },
      { id: '2', username: 'sarah_data', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', isOnline: true },
      { id: '3', username: 'mike_ai', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', isOnline: false },
      { id: '4', username: 'jenny_ml', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jenny', isOnline: true }
    ]);

    return () => {
      // TODO: Cleanup Socket.io connection
      setIsConnected(false);
    };
  }, [currentRoom]);

  // Remove the separate fetchMessages function

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/messages', {
        content: inputMessage.trim(),
        room: currentRoom,
        type: 'text'
      });

      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, response.data.message]);
      setInputMessage('');
      
      // TODO: Emit message via Socket.io for real-time updates
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomChange = (roomId) => {
    setCurrentRoom(roomId);
    setMessages([]); // Clear messages while loading new room
  };

  const currentRoomInfo = rooms.find(room => room.id === currentRoom);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-900 dark:text-white">
                Community
              </span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-gray-600 dark:text-gray-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Rooms */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Channels
          </h3>
          <div className="space-y-1">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentRoom === room.id 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleRoomChange(room.id)}
              >
                <div className="flex items-center space-x-3">
                  <room.icon className={`h-4 w-4 ${
                    currentRoom === room.id 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      currentRoom === room.id 
                        ? 'text-green-900 dark:text-green-100' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {room.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {room.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Online Users */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Online Users ({onlineUsers.filter(u => u.isOnline).length})
            </h3>
            <div className="space-y-2">
              {onlineUsers.map((onlineUser) => (
                <div key={onlineUser.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="relative">
                    <Image
                      src={onlineUser.avatar}
                      alt={onlineUser.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                      onlineUser.isOnline ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {onlineUser.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {onlineUser.isOnline ? 'Online' : 'Away'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src={user?.avatar || '/default-avatar.png'}
                alt={user?.username || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.username}
              </p>
              <p className="text-xs text-green-600">
                Online
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <currentRoomInfo.icon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentRoomInfo?.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentRoomInfo?.description} • {messages.length} messages
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex space-x-3"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Image
                    src={message.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.username}`}
                    alt={message.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {message.username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Welcome message for empty rooms */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <currentRoomInfo.icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Welcome to #{currentRoomInfo?.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {currentRoomInfo?.description}. Start a conversation!
              </p>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message #${currentRoomInfo?.name}...`}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Be respectful and follow our community guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
