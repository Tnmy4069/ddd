'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, MessageCircle, Users, Zap, Shield, Sparkles, Sun, Moon, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import ImageSlider from '@/components/ui/image-slider';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [openItems, setOpenItems] = useState(new Set());
  const [mounted, setMounted] = useState(false);

  // Ensure theme is properly mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
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

  const features = [
    {
      icon: Bot,
      title: "Advanced AI Chatbot",
      description: "Intelligent conversations powered by state-of-the-art language models with personalized responses."
    },
    {
      icon: Users,
      title: "Community Chat",
      description: "Real-time messaging with fellow users, share insights, and collaborate on projects."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with instant responses and seamless user experience."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption and robust security measures to protect your data."
    },
    {
      icon: Sparkles,
      title: "Smart Analytics",
      description: "Comprehensive analytics and insights to help you make data-driven decisions."
    },
    {
      icon: MessageCircle,
      title: "Chat History",
      description: "Never lose a conversation with persistent chat history and easy search functionality."
    }
  ];

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
        }
      ]
    }
  ];

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        {/* Theme Toggle for authenticated users */}
        {/* <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
            title={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
          >
            {mounted && theme === 'dark' ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 text-blue-600" />
            )}
          </Button>
        </div> */}
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6"
            {...fadeInUp}
          >
            Welcome back, {user?.username}! 👋
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            {...fadeInUp}
          >
            Ready to continue your AI-powered journey?
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            {...fadeInUp}
          >
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Start Chatting
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <motion.nav 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-2">
            <Image 
              src="/roboanalyzer-menulogo.png" 
              alt="RoboAnalyzer Logo" 
              width={32} 
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">RoboAnalyzer</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              title={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-blue-600" />
              )}
            </Button> */}
            
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </motion.nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white mb-6"
            variants={fadeInUp}
          >
            AI-Powered
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Analytics</span>
            <br />& Community
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed"
            variants={fadeInUp}
          >
         Experience the future of Robotics with our advanced AI chatbot and vibrant community platform. Get insights, collaborate, and innovate like never before.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            variants={fadeInUp}
          >
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Image Slider Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Explore Our Gallery
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover amazing visuals and insights from our community
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ImageSlider />
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find answers to common questions about RoboAnalyzer
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
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

        {/* FAQ Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
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
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Bot className="h-4 w-4 mr-2" />
                    Get Started & Ask AI
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Explore Features
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need for intelligent analysis and seamless collaboration
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users already experiencing the power of RoboAnalyzer
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Image 
              src="/roboanalyzer-menulogo.png" 
              alt="RoboAnalyzer Logo" 
              width={24} 
              height={24}
              className="w-6 h-6 object-contain"
            />
            <span className="text-lg font-semibold text-gray-800 dark:text-white">RoboAnalyzer</span>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400">
            &copy; 2024 RoboAnalyzer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
