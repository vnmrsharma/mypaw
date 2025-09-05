import React from 'react';
import { CheckCircle, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GeminiResponse } from '../types';

interface PetIdentificationProps {
  petInfo: GeminiResponse;
  imageUrl: string;
  onContinue: () => void;
}

const PetIdentification: React.FC<PetIdentificationProps> = ({ 
  petInfo, 
  imageUrl, 
  onContinue 
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="relative h-64 bg-gradient-to-br from-purple-400 to-pink-400">
          <img
            src={imageUrl}
            alt="Your pet"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-full p-2 shadow-lg"
            >
              <CheckCircle className="w-6 h-6 text-green-500" />
            </motion.div>
          </div>
        </div>
        
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">
                Pet Identified!
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Type & Breed</h3>
                <p className="text-lg text-gray-900 mb-1">
                  {petInfo.type}
                </p>
                {petInfo.breed && (
                  <p className="text-orange-600 font-medium">
                    {petInfo.breed}
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {petInfo.description}
                </p>
              </div>
            </div>
            
            {petInfo.characteristics && petInfo.characteristics.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-3">Key Characteristics</h3>
                <div className="flex flex-wrap gap-2">
                  {petInfo.characteristics.map((trait, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {trait}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              className="w-full mt-8 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center hover:shadow-lg transition-all"
            >
              <Heart className="w-5 h-5 mr-2" />
              Give Your Pet a Name
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PetIdentification;