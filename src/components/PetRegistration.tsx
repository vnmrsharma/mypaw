import React, { useState } from 'react';
import { Save, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GeminiResponse } from '../types';

interface PetRegistrationProps {
  petInfo: GeminiResponse;
  imageUrl: string;
  onSave: (name: string) => void;
  isLoading?: boolean;
}

const PetRegistration: React.FC<PetRegistrationProps> = ({ 
  petInfo, 
  imageUrl, 
  onSave, 
  isLoading 
}) => {
  const [petName, setPetName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (petName.trim()) {
      onSave(petName.trim());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-cyan-400">
          <img
            src={imageUrl}
            alt="Your pet"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4"
            >
              <Sparkles className="w-6 h-6 text-yellow-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Almost Done!
            </h2>
            <p className="text-gray-600">
              What would you like to name your {petInfo.breed || petInfo.type}?
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name
              </label>
              <motion.input
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                type="text"
                id="petName"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Enter your pet's name..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg"
                required
                disabled={isLoading}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!petName.trim() || isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-emerald-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save My Pet
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PetRegistration;