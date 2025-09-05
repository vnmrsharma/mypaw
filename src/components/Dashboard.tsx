import React from 'react';
import { MessageCircle, Heart, Star, Camera, LogOut, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Pet } from '../types';

interface DashboardProps {
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
  onAddNewPet: () => void;
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ pets, onSelectPet, onAddNewPet, onSignOut }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-8 h-8 text-purple-300 opacity-30"
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
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 p-4 relative z-10"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mr-4 shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-7 h-7 text-white" />
              </motion.div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MyPaw Dashboard
              </h1>
              <p className="text-sm text-gray-600">Manage your AI pet companions 🐾</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddNewPet}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Pet
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSignOut}
              className="p-3 hover:bg-red-50 rounded-full transition-colors group"
            >
              <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <div className="container mx-auto px-4 py-8">
        {pets.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.h2 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4"
              >
                Your Pet Companions
              </motion.h2>
              <div className="text-5xl mb-4 animate-bounce">🐾</div>
              <p className="text-gray-600 text-xl">
                Choose a pet to start chatting or manage their diet
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {pets.map((pet, index) => (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden cursor-pointer group border border-white/20"
                  onClick={() => onSelectPet(pet)}
                >
                  <div className="relative h-56 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 overflow-hidden">
                    <img
                      src={pet.image_url}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/30"
                      >
                        {pet.type}
                      </motion.span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800">{pet.name}</h3>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        <Heart className="w-6 h-6 text-red-500" />
                      </motion.div>
                    </div>
                    
                    {pet.breed && (
                      <p className="text-orange-600 font-semibold mb-3 text-lg">{pet.breed}</p>
                    )}
                    
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {pet.description}
                    </p>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center hover:shadow-lg transition-all duration-300 text-lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-3" />
                      Chat with {pet.name}
                    </motion.div>
                  </div>
                    </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-20"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-8"
            >
              🐾
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
            >
              Welcome to MyPaw!
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-gray-600 mb-12 text-xl max-w-md mx-auto"
            >
              Add your first pet to start chatting with your AI companion
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddNewPet}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-12 py-6 rounded-2xl font-bold flex items-center mx-auto hover:shadow-2xl transition-all duration-300 text-xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-8 h-8 text-white" />
              </motion.div>
              <span className="ml-4">Add Your First Pet</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;