import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Heart, Utensils, AlertCircle, Sparkles, MessageCircle, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDietPlan } from '../services/openai';
import { saveDietPlan, getDietPlan } from '../services/supabase';
import type { Pet, DietPlan } from '../types';

interface DietPlanProps {
  pet: Pet;
  onBack: () => void;
  onDietPlanUpdated?: (dietPlan: DietPlan) => void;
  onShowChat?: () => void;
  onShowPawMood?: () => void;
}

const DietPlanComponent: React.FC<DietPlanProps> = ({ pet, onBack, onDietPlanUpdated, onShowChat, onShowPawMood }) => {
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isLoading, setIsLoading] = useState(true);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadExistingDietPlan();
  }, [pet.id]);

  const loadExistingDietPlan = async () => {
    setIsLoading(true);
    try {
      const existingPlan = await getDietPlan(pet.id);
      setDietPlan(existingPlan);
      if (existingPlan && onDietPlanUpdated) {
        onDietPlanUpdated(existingPlan);
      }
    } catch (error) {
      console.error('Error loading diet plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDietPlan = async () => {
    setIsGenerating(true);
    try {
      const personality = JSON.parse(pet.personality);
      const petInfo = `${pet.description}. Characteristics: ${personality.characteristics?.join(', ')}`;
      
      const planData = await generateDietPlan(
        petInfo,
        pet.breed || pet.type,
        pet.type,
        pet.name
      );

      if (planData) {
        const newDietPlan = await saveDietPlan({
          pet_id: pet.id,
          plan_data: planData
        });

        if (newDietPlan) {
          setDietPlan(newDietPlan);
          if (onDietPlanUpdated) {
            onDietPlanUpdated(newDietPlan);
          }
        }
      } else {
        alert('Failed to generate diet plan. Please try again.');
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
      alert('Error generating diet plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading diet plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200 p-4"
      >
        <div className="container mx-auto flex items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </motion.button>
          
          <div className="flex items-center flex-1">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-emerald-200">
              <img
                src={pet.image_url}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{pet.name}'s Diet Plan</h2>
              <p className="text-sm text-gray-600">{pet.breed || pet.type}</p>
            </div>
          </div>
          
          <Utensils className="w-6 h-6 text-emerald-500" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-4xl">
          {!dietPlan ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Utensils className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Generate {pet.name}'s Diet Plan
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create a personalized weekly diet plan based on {pet.name}'s breed, age, and health needs.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateDietPlan}
                disabled={isGenerating}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                {isGenerating ? 'Generating Plan...' : 'Generate Diet Plan'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Day Selector */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-emerald-500" />
                  Weekly Schedule
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <motion.button
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDay(day)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        selectedDay === day
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-emerald-100'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Daily Plan */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDay}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {selectedDay}'s Meal Plan
                  </h3>
                  
                  {dietPlan.plan_data.weekly_plan[selectedDay] && (
                    <div className="space-y-4">
                      {['breakfast', 'lunch', 'dinner', 'treats'].map((meal) => (
                        <div key={meal} className="border-l-4 border-emerald-200 pl-4">
                          <h4 className="font-semibold text-gray-700 capitalize mb-1 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                            {meal}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {dietPlan.plan_data.weekly_plan[selectedDay][meal as keyof typeof dietPlan.plan_data.weekly_plan[typeof selectedDay]]}
                          </p>
                        </div>
                      ))}
                      
                      {dietPlan.plan_data.weekly_plan[selectedDay].notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">Daily Notes</p>
                              <p className="text-sm text-yellow-700">
                                {dietPlan.plan_data.weekly_plan[selectedDay].notes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Guidelines */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Nutritional Guidelines
                  </h3>
                  <ul className="space-y-2">
                    {dietPlan.plan_data.nutritional_guidelines.map((guideline, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        {guideline}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                    Special Considerations
                  </h3>
                  <ul className="space-y-2">
                    {dietPlan.plan_data.special_considerations.map((consideration, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        {consideration}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feeding Schedule & Portions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Feeding Schedule</h3>
                  <p className="text-gray-600 text-sm">{dietPlan.plan_data.feeding_schedule}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Portion Sizes</h3>
                  <p className="text-gray-600 text-sm">{dietPlan.plan_data.portion_sizes}</p>
                </div>
              </div>

              {/* Regenerate Button */}
              <div className="text-center pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateDietPlan}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
                >
                  {isGenerating ? 'Generating...' : 'Generate New Plan'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg relative z-10">
        <div className="flex justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-2 shadow-xl border border-white/20 max-w-sm w-full">
            <div className="grid grid-cols-3 gap-2">
              {/* Chat Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowChat}
                className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-600 rounded-2xl px-4 py-3 flex flex-col items-center justify-center hover:bg-purple-50 transition-all shadow-md relative overflow-hidden group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mb-1"
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.div>
                <span className="font-semibold text-xs">Chat</span>
                
                {/* Pet emoji indicator */}
                <motion.div
                  animate={{ 
                    y: [0, -1, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -top-1 -right-1 text-sm opacity-70"
                >
                  💬
                </motion.div>
                
                {/* Hover effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  className="absolute inset-0 bg-purple-400 rounded-2xl"
                />
              </motion.button>

              {/* Diet Plan Button - Active */}
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl px-4 py-3 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
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
                    <Utensils className="w-5 h-5 mb-1" />
                  </motion.div>
                  <span className="font-semibold text-xs relative z-10">Diet</span>
                  
                  {/* Pet emoji indicator */}
                  <motion.div
                    animate={{ 
                      y: [0, -2, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-1 -right-1 text-lg"
                  >
                    🍽️
                  </motion.div>
                </div>
              </motion.div>

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
};

export default DietPlanComponent;