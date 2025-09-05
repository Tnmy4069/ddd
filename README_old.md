# 🤖 RoboAnalyzer - Full-Stack AI Analytics Platform

A modern, feature-rich Next.js 15 application combining advanced AI chatbot capabilities with real-time community chat functionality. Built with cutting-edge technologies for seamless user experience and robust performance.

## ✨ Features

### 🔐 Authentication System
- **JWT-based authentication** with secure token management
- **bcrypt password hashing** for enhanced security
- **Protected routes** and session persistence
- **User registration/login** with form validation

### 🤖 AI Chatbot
- **OpenAI integration** for intelligent conversations
- **Chat history persistence** with MongoDB storage
- **Typing/loading states** for better UX
- **Quick actions** and FAQ support
- **Multiple AI models** support (GPT-3.5, GPT-4)

### 💬 Community Chat
- **Real-time messaging** with Socket.io
- **User presence** indicators
- **Avatar system** with automatic generation
- **Message timestamps** and history
- **Room-based messaging** (General, specific topics)

### 🎨 Modern UI/UX
- **Tailwind CSS** for responsive design
- **Framer Motion** animations and transitions
- **Dark/Light theme** toggle with system preference detection
- **Toast notifications** for user feedback
- **Loading states** and error handling
- **Mobile-first responsive design**

### 🗄️ Database & Backend
- **MongoDB** with Mongoose ODM
- **RESTful API routes** with proper middleware
- **Data models**: User, Message, ChatHistory
- **Error handling** and validation
- **API rate limiting** and security measures

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Next Themes** - Theme management

### Backend
- **Next.js API Routes** - Full-stack functionality
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### AI Integration
- **OpenAI API** - GPT models for chatbot
- **Axios** - HTTP client for API requests

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roboanalyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/roboanalyzer
   
   # JWT Secret
   JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
   
   # OpenAI API Key
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Next.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   
   # Socket.io
   SOCKET_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # AI chat endpoints
│   │   └── messages/      # Community chat endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── chat/              # AI chat pages
│   ├── community/         # Community chat pages
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Landing page
├── components/            # Reusable components
│   ├── ui/                # Basic UI components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat components
│   └── layout/            # Layout components
├── lib/                   # Utility libraries
│   ├── mongodb.js         # Database connection
│   ├── auth.js            # Authentication utilities
│   ├── openai.js          # OpenAI integration
│   └── utils.js           # General utilities
├── models/                # Database models
│   ├── User.js            # User model
│   ├── Message.js         # Message model
│   └── ChatHistory.js     # Chat history model
├── middleware/            # Custom middleware
│   └── auth.js            # JWT authentication middleware
├── context/               # React contexts
│   └── AuthContext.js     # Authentication context
└── hooks/                 # Custom React hooks
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Next.js setup with Tailwind CSS
- [x] MongoDB integration
- [x] Basic authentication system
- [x] Project structure setup

### Phase 2: Core Features 🚧
- [x] AI chatbot implementation
- [x] Community chat with Socket.io
- [x] User dashboard
- [ ] Chat rooms and channels
- [ ] File upload functionality

### Phase 3: Enhancements 📋
- [ ] Real-time notifications
- [ ] Advanced AI features (image generation, code analysis)
- [ ] User profiles and settings
- [ ] Chat export functionality
- [ ] Admin dashboard

### Phase 4: Production 🎯
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deployment setup
- [ ] Monitoring and analytics
- [ ] Documentation completion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [OpenAI](https://openai.com/) for the powerful AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📞 Support

For support, email support@roboanalyzer.com or join our community chat.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
