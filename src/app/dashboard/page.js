'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bot, 
  MessageCircle, 
  Users, 
  History, 
  Plus, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Trash2,
  Calendar,
  Clock
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { formatDateTime, truncateText } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    recentActivity: 0
  });

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/chat/history');
      const histories = response.data.histories;
      setChatHistory(histories);
      
      // Calculate stats
      const totalChats = histories.length;
      const totalMessages = histories.reduce((sum, chat) => sum + chat.messageCount, 0);
      const recentActivity = histories.filter(chat => {
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return new Date(chat.updatedAt) > dayAgo;
      }).length;
      
      setStats({ totalChats, totalMessages, recentActivity });
    } catch (error) {
      toast.error('Failed to load chat history');
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete('/api/chat/history', { data: { chatId } });
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
      toast.success('Chat deleted successfully');
    } catch (error) {
      toast.error('Failed to delete chat');
      console.error('Error deleting chat:', error);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const quickActions = [
    {
      title: 'New AI Chat',
      description: 'Start a conversation with our AI assistant',
      icon: Bot,
      href: '/chat',
      color: 'bg-blue-500'
    },
    {
      title: 'Community Chat',
      description: 'Join the community discussion',
      icon: Users,
      href: '/community',
      color: 'bg-green-500'
    },
    {
      title: 'Browse History',
      description: 'Review your past conversations',
      icon: History,
      href: '#history',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                RoboAnalyzer
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.username || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.username}
                </span>
              </div>

              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Welcome Section */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Ready to dive into some AI-powered conversations?
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={fadeInUp}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChats}</div>
                <p className="text-xs text-muted-foreground">
                  Conversations created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMessages}</div>
                <p className="text-xs text-muted-foreground">
                  Total messages exchanged
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentActivity}</div>
                <p className="text-xs text-muted-foreground">
                  Chats in last 24h
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Link href={action.href}>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat History */}
          <motion.div id="history" variants={fadeInUp}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Conversations
              </h2>
              <Link href="/chat">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="loading-spinner h-8 w-8"></div>
              </div>
            ) : chatHistory.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No conversations yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Start your first AI conversation to see it here
                  </p>
                  <Link href="/chat">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Start Chatting
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {chatHistory.slice(0, 6).map((chat) => (
                  <motion.div key={chat.id} variants={fadeInUp}>
                    <Card className="hover:shadow-md transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg truncate">
                              {chat.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {chat.messageCount} messages
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteChat(chat.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {truncateText(chat.lastMessage, 120)}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDateTime(chat.updatedAt)}
                          </div>
                          <Link href={`/chat/${chat.id}`}>
                            <Button variant="outline" size="sm">
                              Continue
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {chatHistory.length > 6 && (
              <div className="text-center mt-6">
                <Button variant="outline">
                  View All Conversations
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
