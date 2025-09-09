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
  Clock,
  Shield,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';
import ImageSlider from '@/components/ui/image-slider';

export default function DashboardPage() {
  const { user, logout, isLoading: authLoading, isAuthenticated } = useAuth();
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
    if (!authLoading && (!user || !isAuthenticated)) {
      const timer = setTimeout(() => {
        if (!user || !isAuthenticated) {
          console.log('Dashboard: Redirecting to login - not authenticated');
          window.location.href = '/auth/login';
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, isAuthenticated, authLoading]);

  const loadChatHistory = useCallback(async () => {
    // Only load if user exists and is authenticated
    if (!user || !isAuthenticated) {
      console.log('Skipping chat history load - not authenticated', { user: !!user, isAuthenticated });
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Loading chat history for authenticated user:', user.username);
      
      const response = await fetch('/api/chat/history', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          const chats = data.chats || [];
          setChatHistory(chats);
        } else {
          setChatHistory([]);
        }
      } else {
        throw new Error('Failed to load chat history');
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
      setChatHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  const loadStats = useCallback(async () => {
    // Only load if user exists and is authenticated
    if (!user || !isAuthenticated) {
      return;
    }
    
    try {
      const response = await fetch('/api/stats', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          setStats(data.stats || {
            totalChats: 0,
            totalMessages: 0,
            recentActivity: 0
          });
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Keep default stats on error
    }
  }, [user, isAuthenticated]);

  const deleteChat = async (chatId) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast.success('Chat deleted successfully');
        loadChatHistory(); // Reload the list
        loadStats(); // Reload the stats
      } else {
        throw Error('Failed to delete chat');
      }
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
    // Only load when user is authenticated and auth loading is complete
    if (user && isAuthenticated && !authLoading) {
      console.log('Dashboard: Loading data for authenticated user');
      loadChatHistory();
      loadStats();
    }
  }, [user, isAuthenticated, authLoading, loadChatHistory, loadStats]);

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

  // Add admin link if user is admin
  if (user && user.role === 'admin') {
    quickActions.push({
      title: 'Admin Dashboard',
      description: 'System administration',
      icon: Shield,
      href: '/admin',
      color: 'bg-red-500 hover:bg-red-600'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Image 
                src="/roboanalyzer-menulogo.png" 
                alt="RoboAnalyzer Logo" 
                width={32} 
                height={32}
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                RoboAnalyzer Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-600" />
                )}
              </Button> */}
              
              {/* User Avatar & Menu */}
              <div className="flex items-center space-x-3">
                <Image
                  src="/avatar.svg"
                  alt={user.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.username}
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
            Welcome back, {user.username}!
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

        {/* Image Slider */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Featured Gallery
          </h3>
          <ImageSlider />
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

        {/* FAQ Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <Link href="/faq">
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                View All FAQs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FAQ Item 1 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Bot className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Is RoboAnalyzer a free software?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      We would like to term this as &quot;Priceless Software&quot; as it has immense value for a zero cost.
                    </p>
                    <Link href="/faq">
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                        Read more <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Item 2 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <MessageCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      How does the AI chatbot work?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Our AI chatbot is powered by Google&apos;s Gemini 1.5 Flash model, providing intelligent responses...
                    </p>
                    <Link href="/faq">
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                        Read more <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Item 3 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Settings className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Why am I not able to launch RoboAnalyzer application?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Most likely, you have tried to launch RoboAnalyzer.exe from a zip folder...
                    </p>
                    <Link href="/faq">
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                        Read more <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Item 4 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Users className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      How does the community chat work?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      The community chat allows real-time messaging with other RoboAnalyzer users...
                    </p>
                    <Link href="/faq">
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                        Read more <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ CTA */}
          <div className="mt-6 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Need more help?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Browse all frequently asked questions or get instant help from our AI assistant.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/faq">
                    <Button size="sm" className="w-full sm:w-auto">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Browse All FAQs
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Bot className="h-4 w-4 mr-2" />
                      Ask AI Assistant
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
