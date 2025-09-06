'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatDateTime } from '@/lib/utils';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    recentActivity: 0
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      const timer = setTimeout(() => {
        if (!user) {
          window.location.href = '/auth/login';
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading]);

  const loadChatHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await api.get('/api/chat/history');
      
      if (response.data && response.data.success) {
        const chats = response.data.chats || [];
        setChatHistory(chats);
        
        // Calculate stats
        setStats({
          totalChats: chats.length,
          totalMessages: chats.reduce((total, chat) => total + (chat.messageCount || 0), 0),
          recentActivity: chats.filter(chat => {
            const lastUpdate = new Date(chat.lastMessage || chat.createdAt);
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return lastUpdate > dayAgo;
          }).length
        });
      } else {
        setChatHistory([]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to load chat history');
      }
      setChatHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteChat = async (chatId) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      await api.delete(`/api/chat/${chatId}`);
      toast.success('Chat deleted successfully');
      loadChatHistory();
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      loadChatHistory();
    }
  }, [user, authLoading, loadChatHistory]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  const quickActions = [
    {
      title: 'Start New Chat',
      description: 'Begin a conversation with AI',
      icon: Bot,
      href: '/chat',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Community Chat',
      description: 'Join the community discussion',
      icon: Users,
      href: '/community',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Settings',
      description: 'Manage your account',
      icon: Settings,
      href: '/settings',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Bot className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                RoboAnalyzer Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              {/* User Avatar & Menu */}
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  user.avatar.startsWith('http') ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your AI conversations and explore the community.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChats}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentActivity}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${action.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Chat History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Chats
            </h3>
            <Link href="/chat">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : chatHistory.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No chats yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start your first conversation with our AI assistant.
                </p>
                <Link href="/chat">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Start First Chat
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {chatHistory.slice(0, 5).map((chat) => (
                <Card key={chat.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <Bot className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {chat.title || 'Untitled Chat'}
                            </h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDateTime(chat.createdAt)}
                              </p>
                              {chat.messageCount && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {chat.messageCount} messages
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/chat/${chat.id}`}>
                          <Button variant="outline" size="sm">
                            Continue
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteChat(chat.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {chatHistory.length > 5 && (
                <div className="text-center pt-4">
                  <Link href="/chat">
                    <Button variant="outline">
                      <History className="h-4 w-4 mr-2" />
                      View All Chats ({chatHistory.length})
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
