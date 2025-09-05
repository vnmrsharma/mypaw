import React from 'react';
import { Heart, MessageCircle, Camera, Brain, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-8 h-8 text-purple-300 opacity-30"
        >
          🐕
        </motion.div>
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute top-32 right-20 w-8 h-8 text-pink-300 opacity-30"
        >
          🐱
        </motion.div>
        <motion.div 
          animate={{ 
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 10 }}
          className="absolute bottom-20 left-1/4 w-6 h-6 text-orange-300 opacity-40"
        >
          🐾
        </motion.div>
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 7 }}
          className="absolute bottom-40 right-1/3 w-5 h-5 text-yellow-300 opacity-35"
        >
          🐰
        </motion.div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="flex items-center"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MyPaw
            </span>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center lg:text-left"
            >

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Talk to Your Pet
                </span>
                <br />
                <span className="text-gray-800">Like Never Before</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                MyPaw lets you talk to your pet to know what's best for him. 
                Upload a photo, create an AI companion, and start meaningful conversations 
                with your furry friend.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 mr-3" />
                  Start Chatting
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Learn More
                </motion.button>
              </motion.div>

            </motion.div>

            {/* Right Column - Visual Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              {/* Main Phone Mockup */}
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring", bounce: 0.4 }}
                className="relative mx-auto w-80 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl shadow-2xl overflow-hidden"
              >
                {/* Phone Screen Content */}
                <div className="absolute inset-4 bg-white rounded-2xl overflow-hidden">
                  <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-orange-400 rounded-full mr-3"></div>
                      <div>
                        <div className="h-2 bg-gray-300 rounded w-16 mb-1"></div>
                        <div className="h-1 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl px-3 py-2 max-w-48">
                          <div className="h-2 bg-gray-300 rounded w-32 mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl px-3 py-2 max-w-32">
                          <div className="h-2 bg-white/80 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl px-3 py-2 max-w-40">
                          <div className="h-2 bg-gray-300 rounded w-28 mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="relative z-10 py-16 px-6"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Why Pet Owners Love MyPaw
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the magic of AI-powered pet communication and care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "Smart Pet Recognition",
                description: "Upload a photo and our AI instantly identifies your pet's breed, personality, and care needs."
              },
              {
                icon: MessageCircle,
                title: "Natural Conversations",
                description: "Chat with your pet using AI that understands their unique personality and responds authentically."
              },
              {
                icon: Brain,
                title: "Personalized Care",
                description: "Get custom diet plans and mood insights tailored specifically to your pet's needs and behavior."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="relative z-10 bg-white/50 backdrop-blur-sm border-t border-white/20 py-8 px-6"
      >
        <div className="container mx-auto text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center mb-4"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mr-2">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MyPaw
            </span>
          </motion.div>
          <p className="text-gray-600 text-sm">
            © 2025 MyPaw. All rights reserved. Made with ❤️ for pet lovers everywhere.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
