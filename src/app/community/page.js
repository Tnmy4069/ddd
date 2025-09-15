'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Send, 
  Home, 
  MessageCircle,
  RefreshCw,
  User,
  Sun,
  Moon,
  Edit3,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CommunityPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [showAdminControls, setShowAdminControls] = useState(true);
  const messagesEndRef = useRef(null);

  // Simplified - just use general room
  const currentRoom = 'general';

  const loadMessages = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages?room=${currentRoom}&limit=50`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        throw new Error('Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [user, currentRoom]);

  // Load messages on component mount
  useEffect(() => {
    if (user) {
      loadMessages();
      // Auto-refresh every 5 seconds
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [user, loadMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !user || isSending) return;
    
    try {
      setIsSending(true);
      
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: inputMessage.trim(),
          room: currentRoom,
          type: 'text'
        })
      });
      
      setInputMessage('');
      
      // Refresh messages to show the new message
      await loadMessages();
      
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to send messages');
      } else {
        toast.error('Failed to send message');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newContent
        })
      });

      if (response.ok) {
        toast.success('✅ Message updated successfully (Admin)');
        setEditingMessageId(null);
        setEditingContent('');
        await loadMessages();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('⚠️ ADMIN ACTION: Are you sure you want to permanently delete this message?\n\nThis action cannot be undone and will remove the message for all users.')) {
      return;
    }

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('✅ Message deleted successfully (Admin)');
        await loadMessages();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const startEditing = (messageId, currentContent) => {
    setEditingMessageId(messageId);
    setEditingContent(currentContent);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const isAdmin = user?.role === 'admin';

  // Keyboard shortcut for admins to toggle admin controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isAdmin && event.ctrlKey && event.key === 'a') {
        event.preventDefault();
        setShowAdminControls(prev => !prev);
        toast.success(`Admin controls ${!showAdminControls ? 'enabled' : 'disabled'}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, showAdminControls]);

  // Show loading if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Login Required
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please log in to join the community chat
            </p>
            <Link href="/auth/login">
              <Button>
                Log In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image 
                src="/roboanalyzer-menulogo.png" 
                alt="RoboAnalyzer Logo" 
                width={32} 
                height={32}
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Community Chat
                  {isAdmin && (
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Connect with other users
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <Button
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
              </Button>
              {isAdmin && (
                <Button
                  variant={showAdminControls ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAdminControls(!showAdminControls)}
                  className="text-xs"
                  title="Toggle admin controls (Ctrl+A)"
                >
                  {showAdminControls ? 'Hide Admin' : 'Show Admin'}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={loadMessages} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>General Discussion</span>
                <span className="text-sm font-normal text-gray-500">
                  ({messages.length} messages)
                </span>
                {isAdmin && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    showAdminControls 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    Admin {showAdminControls ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
              {isAdmin && (
                <div className="text-xs text-gray-500">
                  {showAdminControls ? 'Hover messages to see admin controls' : 'Admin controls hidden (Ctrl+A to toggle)'}
                </div>
              )}
            </CardTitle>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  No messages yet. Be the first to start the conversation!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex space-x-3 group hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {message.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.createdAt)}
                        </span>
                        {message.edited && (
                          <span className="text-xs text-gray-400 italic">
                            (edited)
                          </span>
                        )}
                        {isAdmin && (
                          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-1 rounded">
                            ID: {message.id.slice(-6)}
                          </span>
                        )}
                      </div>
                      {isAdmin && showAdminControls && (
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(message.id, message.content)}
                            className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Edit message (Admin)"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMessage(message.id)}
                            className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete message (Admin)"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {editingMessageId === message.id ? (
                      <div className="mt-2 space-y-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Editing message as Admin
                        </div>
                        <Input
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="text-sm"
                          maxLength={1000}
                          placeholder="Edit message content..."
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditMessage(message.id, editingContent)}
                              disabled={!editingContent.trim()}
                              className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={cancelEditing}
                              className="h-7 px-3 text-xs"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                          <span className="text-xs text-gray-500">
                            {editingContent.length}/1000
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {message.content}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isSending}
                className="flex-1"
                maxLength={1000}
              />
              <Button 
                type="submit" 
                disabled={!inputMessage.trim() || isSending}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • {inputMessage.length}/1000 characters
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
