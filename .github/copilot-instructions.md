# RoboAnalyzer - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
RoboAnalyzer is a full-stack Next.js 15 application with integrated AI chatbot and community chat features.

## Technical Stack
- **Frontend**: Next.js 15 (App Router), React, JavaScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB, Socket.io
- **Authentication**: JWT with bcrypt hashing
- **AI Integration**: OpenAI/Claude APIs
- **Real-time**: Socket.io for community chat
- **Database**: MongoDB with Mongoose ODM

## Code Guidelines
1. Use JavaScript (not TypeScript) throughout the project
2. Follow Next.js 15 App Router conventions
3. Use Tailwind CSS for styling with responsive design principles
4. Implement proper error handling and loading states
5. Use Framer Motion for animations and transitions
6. Follow RESTful API design patterns
7. Implement proper JWT middleware for protected routes
8. Use bcrypt for password hashing
9. Maintain clean component architecture with proper separation of concerns
10. Include proper error boundaries and toast notifications

## Folder Structure
- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions, database connections, auth helpers
- `/src/models` - MongoDB/Mongoose models
- `/src/middleware` - Custom middleware functions
- `/src/hooks` - Custom React hooks
- `/src/context` - React Context providers
- `/src/styles` - Global styles and Tailwind configurations

## Key Features to Implement
1. **Authentication System**: JWT-based auth with registration/login
2. **AI Chatbot**: Interactive chat interface with AI integration
3. **Community Chat**: Real-time messaging with Socket.io
4. **Dashboard**: User dashboard with chat history and settings
5. **Landing Page**: Modern, responsive landing page
6. **Theme System**: Dark/light mode toggle
7. **Responsive Design**: Mobile-first approach

## Development Practices
- Always include loading states and error handling
- Use proper TypeScript annotations where applicable
- Implement proper form validation
- Follow accessibility best practices
- Use environment variables for sensitive data
- Implement proper logging and monitoring
- Write clean, documented code with meaningful variable names
