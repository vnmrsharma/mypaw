import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Send, MessageCircle, ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Pet, ChatMessage, DietPlan } from '../types';

interface ChatInterfaceProps {
  pet: Pet;
  onBack: () => void;
  onShowDietPlan: () => void;
  onShowPawMood: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  dietPlan?: DietPlan;
}

export default function ChatInterface({ pet, onBack, onShowDietPlan, onShowPawMood, messages, onSendMessage, isLoading, dietPlan }: ChatInterfaceProps) {
  // Chat input state
  const [newMessage, setNewMessage] = useState('');
  const [expandedReasons, setExpandedReasons] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle the reasoning explanation for a message
  const toggleReasoning = (messageId: string) => {
    const newExpanded = new Set(expandedReasons);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedReasons(newExpanded);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setIsTyping(true);
    onSendMessage(userMessage);
    
    // Simulate typing delay
    setTimeout(() => setIsTyping(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-20 left-10 w-6 h-6 bg-purple-300 rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 5 }}
          className="absolute bottom-32 right-20 w-4 h-4 bg-pink-300 rounded-full"
        />
      </div>
      
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-purple-100 p-4 flex items-center justify-between shadow-lg relative z-10">
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-3 rounded-full hover:bg-purple-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-purple-600" />
          </motion.button>
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 ring-2 ring-purple-200 shadow-lg"
            >
              <img
                src={pet.image_url}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{pet.name}</h2>
              <p className="text-sm text-purple-600 font-medium">{pet.breed}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-5 h-5 text-pink-500" />
          </motion.div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.is_from_pet ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.is_from_pet ? '' : 'flex flex-col items-end'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.is_from_pet
                      ? 'bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg border border-white/20'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  }`}
                >
                  <p className="leading-relaxed">{message.message}</p>
                </div>
                
                {message.is_from_pet && message.reasoning && (
                  <div className="mt-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => toggleReasoning(message.id)}
                      className="flex items-center text-xs text-gray-500 hover:text-purple-600 transition-colors font-medium"
                    >
                      <span className="mr-1">Why {pet.name} said this</span>
                      {expandedReasons.has(message.id) ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </motion.button>
                    
                    <AnimatePresence>
                      {expandedReasons.has(message.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 p-3 bg-purple-50/80 backdrop-blur-sm rounded-lg text-xs text-gray-600 border-l-3 border-purple-300 shadow-sm"
                        >
                          <p className="italic">{message.reasoning}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg border border-white/20">
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-purple-100 p-6 shadow-lg relative z-10">
        <div className="flex items-end space-x-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${pet.name}...`}
            className="flex-1 resize-none border-2 border-purple-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 focus:shadow-lg bg-white/80 backdrop-blur-sm"
            rows={1}
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-purple-100 p-4 shadow-lg relative z-10">
        <div className="flex justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-2 shadow-xl border border-white/20 max-w-sm w-full">
            <div className="grid grid-cols-3 gap-2">
              {/* Chat Button - Active */}
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl px-4 py-3 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                  {/* Animated background */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white/20 rounded-2xl"
                  />
                  
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <MessageCircle className="w-5 h-5 mb-1" />
                  </motion.div>
                  <span className="font-semibold text-xs relative z-10">Chat</span>
                  
                  {/* Pet emoji indicator */}
                  <motion.div
                    animate={{ 
                      y: [0, -2, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-1 -right-1 text-lg"
                  >
                    💬
                  </motion.div>
                </div>
              </motion.div>

              {/* Diet Plan Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowDietPlan}
                className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200 text-emerald-600 rounded-2xl px-4 py-3 flex flex-col items-center justify-center hover:bg-emerald-50 transition-all shadow-md relative overflow-hidden group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mb-1"
                >
                  <Brain className="w-5 h-5" />
                </motion.div>
                <span className="font-semibold text-xs">Diet</span>
                
                {/* Pet emoji indicator */}
                <motion.div
                  animate={{ 
                    y: [0, -1, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -top-1 -right-1 text-sm opacity-70"
                >
                  🍽️
                </motion.div>
                
                {/* Hover effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  className="absolute inset-0 bg-emerald-400 rounded-2xl"
                />
              </motion.button>

              {/* PawMood Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowPawMood}
                className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200 text-indigo-600 rounded-2xl px-4 py-3 flex flex-col items-center justify-center hover:bg-indigo-50 transition-all shadow-md relative overflow-hidden group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  animate={{ 
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-1"
                >
                  <Brain className="w-5 h-5" />
                </motion.div>
                <span className="font-semibold text-xs">Mood</span>
                
                {/* Pet emoji indicator */}
                <motion.div
                  animate={{ 
                    y: [0, -2, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                  className="absolute -top-1 -right-1 text-sm opacity-70"
                >
                  🧠
                </motion.div>
                
                {/* Hover effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  className="absolute inset-0 bg-indigo-400 rounded-2xl"
                />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}