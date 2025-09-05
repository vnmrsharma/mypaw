import React, { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from './components/AuthForm';
import ImageUpload from './components/ImageUpload';
import PetIdentification from './components/PetIdentification';
import PetRegistration from './components/PetRegistration';
import ChatInterface from './components/ChatInterface';
import DietPlan from './components/DietPlan';
import Dashboard from './components/Dashboard';
import PawMood from './components/PawMood';
import { identifyPet } from './services/gemini';
import { createPetPersona, chatWithPet } from './services/openai';
import { 
  savePet, 
  getPets, 
  saveChatMessage, 
  getChatMessages, 
  uploadPetImage,
  getDietPlan,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  supabase
} from './services/supabase';
import type { Pet, GeminiResponse, ChatMessage, DietPlan as DietPlanType, AIResponse } from './types';

type AppStep = 'auth' | 'dashboard' | 'upload' | 'identify' | 'register' | 'chat' | 'diet' | 'pawmood';

interface ChatHistory {
  role: string;
  content: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [petInfo, setPetInfo] = useState<GeminiResponse | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentDietPlan, setCurrentDietPlan] = useState<DietPlanType | null>(null);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (authLoading) {
        console.warn('Auth loading timeout, setting to false');
        setAuthLoading(false);
      }
    }, 5000);

    checkAuthState();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        if (session?.user) {
          setUser(session.user);
          await loadUserPets();
        } else {
          setUser(null);
          setPets([]);
          setCurrentPet(null);
          setCurrentStep('auth');
        }
        setAuthLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        console.log('Current user found:', currentUser.id);
        await loadUserPets();
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadUserPets = async () => {
    try {
      console.log('Loading user pets...');
      const fetchedPets = await getPets();
      console.log('Fetched pets:', fetchedPets.length);
      setPets(fetchedPets);
      
      if (fetchedPets.length > 0) {
        setCurrentStep('dashboard');
      } else {
        setCurrentStep('upload');
      }
    } catch (error) {
      console.error('Error loading user pet:', error);
      setCurrentStep('upload');
    }
  };

  const handleSelectPet = async (pet: Pet) => {
    setCurrentPet(pet);
    await loadChatMessages(pet.id);
    await loadDietPlan(pet.id);
    setCurrentStep('chat');
  };

  const handleAddNewPet = () => {
    setCurrentStep('upload');
  };

  const handleSignUp = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await signUp(email, password);
      // User will be set via auth state change listener
    } catch (error) {
      setAuthLoading(false);
      throw error;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await signIn(email, password);
      // User will be set via auth state change listener
    } catch (error) {
      setAuthLoading(false);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const loadChatMessages = async (petId: string) => {
    const messages = await getChatMessages(petId);
    setChatMessages(messages);
    
    // Convert to chat history format
    const history: ChatHistory[] = messages.map(msg => ({
      role: msg.is_from_pet ? 'assistant' : 'user',
      content: msg.message
    }));
    setChatHistory(history);
  };

  const loadDietPlan = async (petId: string) => {
    try {
      const dietPlan = await getDietPlan(petId);
      setCurrentDietPlan(dietPlan);
    } catch (error) {
      console.error('Error loading diet plan:', error);
    }
  };
  const handleImageCapture = async (imageData: string, file: File) => {
    setIsLoading(true);
    setCapturedImage(URL.createObjectURL(file));
    setImageFile(file);

    try {
      const result = await identifyPet(imageData);
      if (result) {
        setPetInfo(result);
        setCurrentStep('identify');
      } else {
        alert('Unable to identify the pet. Please try again with a clearer image.');
      }
    } catch (error) {
      console.error('Error identifying pet:', error);
      alert('Error identifying pet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToRegistration = () => {
    setCurrentStep('register');
  };

  const handleSavePet = async (name: string) => {
    if (!petInfo || !capturedImage) return;

    setIsLoading(true);
    try {
      // Generate a temporary pet ID for image upload
      const tempPetId = `temp-${Date.now()}`;
      
      // Upload image to Supabase storage
      let imageUrl = capturedImage;
      if (imageFile) {
        const uploadedUrl = await uploadPetImage(imageFile, tempPetId);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const newPet: Omit<Pet, 'id' | 'created_at'> = {
        name,
        type: petInfo.type,
        breed: petInfo.breed,
        description: petInfo.description,
        personality: JSON.stringify({
          characteristics: petInfo.characteristics,
          care_tips: petInfo.care_tips
        }),
        image_url: imageUrl
      };

      const savedPet = await savePet(newPet);
      if (savedPet) {
        // Update pets list
        setPets(prev => [savedPet, ...prev]);
        setCurrentPet(savedPet);
        
        // Create initial AI greeting
        const greeting = await createPetPersona(
          petInfo.description,
          petInfo.breed || petInfo.type,
          petInfo.type,
          name
        );
        
        // Save the greeting as the first message
        await saveChatMessage({
          pet_id: savedPet.id,
          message: greeting,
          is_from_pet: true
        });

        // Load chat messages and go to dashboard
        await loadChatMessages(savedPet.id);
        setCurrentStep('dashboard');
        // Reset state
        setCapturedImage('');
        setImageFile(null);
        setPetInfo(null);
      }
    } catch (error) {
      console.error('Error saving pet:', error);
      alert('Error saving pet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentPet) return;

    // Save user message
    const userMessage = await saveChatMessage({
      pet_id: currentPet.id,
      message,
      is_from_pet: false
    });

    if (userMessage) {
      setChatMessages(prev => [...prev, userMessage]);
      setChatHistory(prev => [...prev, { role: 'user', content: message }]);

      // Get AI response
      const personality = JSON.parse(currentPet.personality);
      let petContext = `${currentPet.description}. Characteristics: ${personality.characteristics?.join(', ')}`;
      
      // Add diet plan context if available
      if (currentDietPlan) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todaysPlan = currentDietPlan.plan_data.weekly_plan[today];
        if (todaysPlan) {
          petContext += `. Today's diet plan: Breakfast: ${todaysPlan.breakfast}, Lunch: ${todaysPlan.lunch}, Dinner: ${todaysPlan.dinner}, Treats: ${todaysPlan.treats}`;
        }
      }
      
      const petResponse = await chatWithPet(
        message,
        petContext,
        currentPet.breed || currentPet.type,
        currentPet.type,
        currentPet.name,
        chatHistory
      );

      // Save AI message
      const aiMessage = await saveChatMessage({
        pet_id: currentPet.id,
        message: petResponse.response,
        reasoning: petResponse.reasoning,
        is_from_pet: true
      });

      if (aiMessage) {
        setChatMessages(prev => [...prev, aiMessage]);
        setChatHistory(prev => [...prev, { role: 'assistant', content: petResponse.response }]);
      }
    }
  };

  const handleShowDietPlan = () => {
    setCurrentStep('diet');
  };

  const handleShowPawMood = () => {
    setCurrentStep('pawmood');
  };

  const handleBackToDashboard = () => {
    setCurrentStep('dashboard');
  };

  const handleBackToChat = async () => {
    if (currentPet) {
      await loadDietPlan(currentPet.id);
    }
    setCurrentStep('chat');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading MyPaw...</p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'auth':
        return (
          <AuthForm
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            isLoading={authLoading}
          />
        );
        
      case 'dashboard':
        return (
          <Dashboard
            pets={pets}
            onSelectPet={handleSelectPet}
            onAddNewPet={handleAddNewPet}
            onSignOut={handleSignOut}
          />
        );
        
      case 'upload':
        return (
          <ImageUpload 
            onImageCapture={handleImageCapture}
            isLoading={isLoading}
            onBack={pets.length > 0 ? handleBackToDashboard : undefined}
          />
        );
      
      case 'identify':
        return petInfo && (
          <PetIdentification
            petInfo={petInfo}
            imageUrl={capturedImage}
            onContinue={handleContinueToRegistration}
          />
        );
      
      case 'register':
        return petInfo && (
          <PetRegistration
            petInfo={petInfo}
            imageUrl={capturedImage}
            onSave={handleSavePet}
            isLoading={isLoading}
          />
        );
      
      case 'chat':
        return currentPet && (
          <ChatInterface
            pet={currentPet}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onBack={handleBackToDashboard}
            onShowDietPlan={handleShowDietPlan}
            onShowPawMood={handleShowPawMood}
            isLoading={isLoading}
          />
        );
      
      case 'diet':
        return currentPet && (
          <DietPlan
            pet={currentPet}
            onBack={handleBackToDashboard}
            onDietPlanUpdated={(dietPlan) => setCurrentDietPlan(dietPlan)}
          />
        );
      
      case 'pawmood':
        return currentPet && (
          <PawMood
            pet={currentPet}
            onBack={handleBackToDashboard}
          />
        );
      
      default:
        return null;
    }
  };

  if (currentStep === 'auth' || currentStep === 'dashboard' || currentStep === 'chat' || currentStep === 'diet' || currentStep === 'pawmood') {
    return renderCurrentStep();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            MyPaw 🐾
          </h1>
          <p className="text-gray-600">
            Create AI companions for your beloved pets
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">
                {currentStep === 'upload' ? 'Identifying your pet...' : 'Saving your pet...'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;