'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronUp, 
  Home, 
  MessageCircle, 
  Bot, 
  Users,
  Settings,
  Shield,
  Zap,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState(new Set());
  const { theme, setTheme } = useTheme();

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqs = [
    {
      category: "RoboAnalyzer Software",
      icon: Bot,
      color: "text-blue-600",
      questions: [
        {
          question: "Is RoboAnalyzer a free software?",
          answer: "We would like to term this as \"Priceless Software\" as it has immense value for a zero cost. The developers believe that \"Free Software\" word has lost its value and hence the new term!"
        },
        {
          question: "Why am I not able to launch RoboAnalyzer application?",
          answer: "Most likely, you have tried to launch RoboAnalyzer.exe from a zip folder. Kindly unzip the folder and launch the application from the unzipped folder."
        },
        {
          question: "Why is the 3D CAD model of the robot not loaded? I only see few coordinate frames.",
          answer: "3D CAD models of robots are not loaded maybe because of Operating System (OS) setting which considers comma for decimal. Kindly make OS settings to consider dot as decimal delimeter and the models shall be shown. We are working on fixing this issue."
        },
        {
          question: "Is Undo feature supported in RoboAnalyzer and Virtual Robot Module (VRM)?",
          answer: "Unfortunately it is not there. We shall try to implement in the versions to come."
        },
        {
          question: "How can we give feedback on RoboAnalyzer?",
          answer: "Kindly give your valuable feedback through our community chat or contact our support team. Your feedback helps us improve the software continuously."
        },
        {
          question: "Can we suggest new features in RoboAnalyzer?",
          answer: "Yes. Kindly send your suggestions or features you want through our AI chat interface or community discussions. We value user input for future development."
        }
      ]
    },
    {
      category: "Getting Started",
      icon: MessageCircle,
      color: "text-green-600",
      questions: [
        {
          question: "What is RoboAnalyzer?",
          answer: "RoboAnalyzer is a comprehensive AI-powered analytics platform that combines advanced chatbot capabilities with community features. It helps users analyze data, get insights, and collaborate with others through intelligent conversations and real-time messaging."
        },
        {
          question: "How do I create an account?",
          answer: "Simply click the 'Get Started' button on our homepage or navigate to the registration page. Fill in your username, email, and password, then verify your email address to activate your account."
        },
        {
          question: "Is the web platform free to use?",
          answer: "Yes! The RoboAnalyzer web platform offers a robust free tier that includes AI chat capabilities, community access, and basic analytics. Premium features may be available for advanced users in the future."
        },
        {
          question: "What browsers are supported?",
          answer: "RoboAnalyzer works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience."
        }
      ]
    },
    {
      category: "AI Chat Features",
      icon: Zap,
      color: "text-purple-600",
      questions: [
        {
          question: "How does the AI chatbot work?",
          answer: "Our AI chatbot is powered by Google's Gemini 1.5 Flash model, providing intelligent responses to your questions about data analysis, coding, general queries, and more. It maintains conversation context and learns from your interactions."
        },
        {
          question: "Can I save my chat conversations?",
          answer: "Yes! All your chat conversations are automatically saved and can be accessed from your dashboard. You can continue previous conversations or start new ones at any time."
        },
        {
          question: "What types of questions can I ask?",
          answer: "You can ask about data analysis, coding help, RoboAnalyzer software guidance, general knowledge questions, problem-solving, and much more. The AI is designed to help with a wide range of topics."
        },
        {
          question: "How accurate are the AI responses?",
          answer: "Our AI provides highly accurate responses based on its training data, but it's always good practice to verify important information. The AI can make mistakes, so consider checking critical information from additional sources."
        }
      ]
    },
    {
      category: "Community Features",
      icon: Users,
      color: "text-orange-600",
      questions: [
        {
          question: "How does the community chat work?",
          answer: "The community chat allows real-time messaging with other RoboAnalyzer users. You can join discussions, share insights, ask questions, and collaborate on projects with fellow users."
        },
        {
          question: "Are there different chat rooms?",
          answer: "Currently, we have a general discussion room where all community members can interact. Additional specialized rooms may be added based on user feedback and demand."
        },
        {
          question: "Can I share files in community chat?",
          answer: "Currently, the community chat supports text messages. File sharing capabilities may be added in future updates based on user needs and security considerations."
        },
        {
          question: "How is the community moderated?",
          answer: "Our community is moderated to ensure a respectful and helpful environment. Users are expected to follow our community guidelines, and inappropriate content will be removed."
        }
      ]
    },
    {
      category: "Account & Settings",
      icon: Settings,
      color: "text-indigo-600",
      questions: [
        {
          question: "How do I change my password?",
          answer: "Navigate to your Settings page from the dashboard menu. There you can update your password, along with other account information like your username and email."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account from the Settings page. Please note that this action is permanent and will remove all your chat history and data."
        },
        {
          question: "How do I switch between dark and light mode?",
          answer: "You can toggle between dark and light themes using the theme switcher button (sun/moon icon) in the top navigation bar of any page."
        },
        {
          question: "Can I export my chat history?",
          answer: "Chat export functionality is planned for future releases. Currently, you can copy individual messages or conversations manually."
        }
      ]
    },
    {
      category: "Privacy & Security",
      icon: Shield,
      color: "text-red-600",
      questions: [
        {
          question: "How is my data protected?",
          answer: "We use industry-standard encryption and security practices to protect your data. All communications are secured, and we never share your personal information with third parties without consent."
        },
        {
          question: "Are my conversations private?",
          answer: "Your AI chat conversations are private and only visible to you. Community chat messages are visible to all community members, as expected in a public chat environment."
        },
        {
          question: "Do you store my chat messages?",
          answer: "Yes, we store your chat messages to provide continuity and allow you to access your conversation history. You can delete individual conversations or your entire account if desired."
        },
        {
          question: "How long is my data retained?",
          answer: "Your data is retained as long as your account is active. If you delete your account, your data is permanently removed from our systems within 30 days."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: HelpCircle,
      color: "text-red-600",
      questions: [
        {
          question: "What should I do if I encounter a bug?",
          answer: "If you encounter any issues, please report them through our support channels. Include details about what you were doing when the issue occurred and any error messages you received."
        },
        {
          question: "Why is the AI responding slowly?",
          answer: "Response times can vary based on server load and the complexity of your question. If you're experiencing consistently slow responses, try refreshing the page or check your internet connection."
        },
        {
          question: "The page won't load properly. What should I do?",
          answer: "Try refreshing the page, clearing your browser cache, or trying a different browser. If the issue persists, it may be a temporary server issue - please try again in a few minutes."
        },
        {
          question: "How do I get help with RoboAnalyzer software?",
          answer: "Our AI chatbot is specifically trained to help with RoboAnalyzer software questions. You can ask about features, troubleshooting, and usage instructions directly in the chat interface."
        }
      ]
    }
  ];

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
                Frequently Asked Questions
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
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
              
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How can we help you?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about RoboAnalyzer
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                    <span className="text-xl">{category.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const itemIndex = `${categoryIndex}-${faqIndex}`;
                      const isOpen = openItems.has(itemIndex);
                      
                      return (
                        <div
                          key={faqIndex}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <button
                            onClick={() => toggleItem(itemIndex)}
                            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
                          >
                            <span className="font-medium text-gray-900 dark:text-white">
                              {faq.question}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Can&apos;t find what you&apos;re looking for? Our AI assistant is here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chat">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Bot className="h-4 w-4 mr-2" />
                    Ask AI Assistant
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Users className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
