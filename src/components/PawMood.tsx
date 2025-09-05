import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, CheckCircle, XCircle, RotateCcw, Sparkles, Trophy, Star, Heart, Target, MessageCircle, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePetMoodScenario } from '../services/openai';
import type { Pet, PetMoodScenario } from '../types';

interface PawMoodProps {
  pet: Pet;
  onBack: () => void;
  onShowChat?: () => void;
  onShowDietPlan?: () => void;
}

const PawMood: React.FC<PawMoodProps> = ({ pet, onBack, onShowChat, onShowDietPlan }) => {
  const [currentScenario, setCurrentScenario] = useState<PetMoodScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [gameComplete, setGameComplete] = useState(false);
  const [answers, setAnswers] = useState<Array<{question: number, correct: boolean, scenario: string, selectedMood: string, correctMood: string}>>([]);

  const maxQuestions = 5;

  useEffect(() => {
    generateNewScenario();
  }, []);

  const generateNewScenario = async () => {
    setIsLoading(true);
    setSelectedMood('');
    setShowResult(false);
    
    try {
      const personality = JSON.parse(pet.personality);
      const petInfo = `${pet.description}. Characteristics: ${personality.characteristics?.join(', ')}`;
      
      const newScenario = await generatePetMoodScenario(
        petInfo,
        pet.breed || pet.type,
        pet.type,
        pet.name
      );

      if (newScenario) {
        // Shuffle the mood options to randomize the order
        const shuffledOptions = [...newScenario.mood_options].sort(() => Math.random() - 0.5);
        setCurrentScenario({
          ...newScenario,
          mood_options: shuffledOptions
        });
      } else {
        alert('Failed to generate scenario. Please try again.');
      }
    } catch (error) {
      console.error('Error generating scenario:', error);
      alert('Error generating scenario. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelection = (mood: string) => {
    if (showResult) return;
    
    setSelectedMood(mood);
    setShowResult(true);
    
    const isCorrect = mood === currentScenario?.correct_mood;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Record the answer
    setAnswers(prev => [...prev, {
      question: currentQuestion,
      correct: isCorrect,
      scenario: currentScenario?.scenario || '',
      selectedMood: mood,
      correctMood: currentScenario?.correct_mood || ''
    }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion >= maxQuestions) {
      setGameComplete(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
      generateNewScenario();
    }
  };

  const handlePlayAgain = () => {
    setScore(0);
    setCurrentQuestion(1);
    setGameComplete(false);
    setAnswers([]);
    generateNewScenario();
  };

  const getScoreColor = () => {
    const percentage = (score / maxQuestions) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / maxQuestions) * 100;
    if (percentage === 100) return `Perfect! You know ${pet.name} inside and out! 🏆`;
    if (percentage >= 80) return `Excellent! You're really in tune with ${pet.name}! 🌟`;
    if (percentage >= 60) return `Good job! You're learning ${pet.name}'s moods well! 👍`;
    return `Keep practicing! Every pet parent learns over time! 💪`;
  };

  const isCorrect = selectedMood === currentScenario?.correct_mood;

  // Game Complete Screen
  if (gameComplete) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
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
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-indigo-200">
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  PawMood Complete!
                </h2>
                <p className="text-sm text-gray-600">Final Results</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-8"
            >
              {/* Score Circle */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg"
                >
                  <div className="text-center">
                    <div className={`text-3xl font-bold text-white`}>
                      {score}/{maxQuestions}
                    </div>
                    <div className="text-white text-sm">
                      {Math.round((score / maxQuestions) * 100)}%
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating stars animation */}
                {score === maxQuestions && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, rotate: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0], 
                          scale: [0, 1, 0],
                          rotate: 360,
                          y: [-20, -60, -100]
                        }}
                        transition={{ 
                          delay: 0.5 + i * 0.2, 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                        className="absolute"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${10 + (i % 2) * 20}%`
                        }}
                      >
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-gray-800 mb-4"
              >
                {getScoreMessage()}
              </motion.h3>
            </motion.div>

            {/* Answer Review */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4 mb-8"
            >
              <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">
                Review Your Answers
              </h4>
              
              {answers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`p-4 rounded-xl border-2 ${
                    answer.correct 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">
                      Question {answer.question}
                    </span>
                    {answer.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {answer.scenario.substring(0, 100)}...
                  </p>
                  <div className="text-sm">
                    <span className="font-medium">Your answer: </span>
                    <span className={answer.correct ? 'text-green-700' : 'text-red-700'}>
                      {answer.selectedMood}
                    </span>
                    {!answer.correct && (
                      <>
                        <br />
                        <span className="font-medium">Correct answer: </span>
                        <span className="text-green-700">{answer.correctMood}</span>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayAgain}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center hover:shadow-lg transition-all"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="bg-white border-2 border-indigo-200 text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
              >
                Back to Chat
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
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
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-indigo-200">
              <img
                src={pet.image_url}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-indigo-500" />
                PawMood with {pet.name}
              </h2>
              <p className="text-sm text-gray-600">Learn to read your pet's emotions</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">
                {currentQuestion}/{maxQuestions}
              </span>
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentQuestion / maxQuestions) * 100}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-2xl">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Creating scenario {currentQuestion}...
              </h3>
              <p className="text-gray-600">
                Generating a mood reading challenge for {pet.name}
              </p>
            </motion.div>
          ) : currentScenario ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Question Counter */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                  <Sparkles className="w-4 h-4 text-indigo-500 mr-2" />
                  <span className="font-medium text-gray-700">
                    Question {currentQuestion} of {maxQuestions}
                  </span>
                </div>
              </motion.div>

              {/* Scenario Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-400"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    What is {pet.name} feeling?
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed text-lg font-medium">
                    {currentScenario.scenario}
                  </p>
                </div>
              </motion.div>

              {/* Mood Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentScenario.mood_options.map((mood, index) => (
                  <motion.button
                    key={mood}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: showResult ? 1 : 1.05 }}
                    whileTap={{ scale: showResult ? 1 : 0.95 }}
                    onClick={() => handleMoodSelection(mood)}
                    disabled={showResult}
                    className={`p-6 rounded-xl font-medium transition-all text-left relative overflow-hidden ${
                      showResult
                        ? mood === currentScenario.correct_mood
                          ? 'bg-green-100 border-2 border-green-500 text-green-800 shadow-lg'
                          : mood === selectedMood
                          ? 'bg-red-100 border-2 border-red-500 text-red-800 shadow-lg'
                          : 'bg-gray-100 border-2 border-gray-200 text-gray-600'
                        : selectedMood === mood
                        ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-800 shadow-md'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize text-lg font-semibold">{mood}</span>
                      {showResult && mood === currentScenario.correct_mood && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </motion.div>
                      )}
                      {showResult && mood === selectedMood && mood !== currentScenario.correct_mood && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <XCircle className="w-6 h-6 text-red-600" />
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Animated background for correct answer */}
                    {showResult && mood === currentScenario.correct_mood && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.1 }}
                        className="absolute inset-0 bg-green-400 rounded-xl"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Result and Explanation */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`rounded-2xl p-6 shadow-lg ${
                      isCorrect
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-red-50 border-2 border-red-200'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {isCorrect ? (
                          <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        ) : (
                          <XCircle className="w-8 h-8 text-red-600 mr-3" />
                        )}
                      </motion.div>
                      <h4 className={`text-xl font-bold ${
                        isCorrect ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {isCorrect ? '🎉 Correct! Well done!' : '❌ Not quite right'}
                      </h4>
                    </div>
                    
                    <div className={`text-sm ${
                      isCorrect ? 'text-green-700' : 'text-red-700'
                    } mb-6`}>
                      <p className="font-medium mb-3 text-base">
                        The correct answer was: <span className="capitalize font-bold">{currentScenario.correct_mood}</span>
                      </p>
                      <div className="bg-white bg-opacity-50 rounded-lg p-4">
                        <p className="leading-relaxed">{currentScenario.explanation}</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextQuestion}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center hover:shadow-lg transition-all"
                    >
                      {currentQuestion >= maxQuestions ? (
                        <>
                          <Trophy className="w-5 h-5 mr-2" />
                          See Final Score
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Next Question ({currentQuestion + 1}/{maxQuestions})
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't generate a scenario. Let's try again!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateNewScenario}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Try Again
              </motion.button>
            </div>
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
                  <Utensils className="w-5 h-5" />
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

              {/* PawMood Button - Active */}
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl px-4 py-3 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
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
                    <Brain className="w-5 h-5 mb-1" />
                  </motion.div>
                  <span className="font-semibold text-xs relative z-10">Mood</span>
                  
                  {/* Pet emoji indicator */}
                  <motion.div
                    animate={{ 
                      y: [0, -2, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-1 -right-1 text-lg"
                  >
                    🧠
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PawMood;