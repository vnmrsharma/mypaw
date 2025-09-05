// Pet data structure
export interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  description: string;
  personality: string;
  image_url: string;
  user_id?: string;
  created_at: string;
}

// Chat message structure
export interface ChatMessage {
  id: string;
  pet_id: string;
  user_id?: string;
  message: string;
  is_from_pet: boolean;
  reasoning?: string;
  created_at: string;
}

// Response from Gemini AI for pet identification
export interface GeminiResponse {
  type: string;
  breed?: string;
  description: string;
  characteristics: string[];
  care_tips: string[];
}

// Main app state structure
export interface AppState {
  currentPet: Pet | null;
  pets: Pet[];
  chatMessages: ChatMessage[];
  isLoading: boolean;
}

// Diet plan structure for pets
export interface DietPlan {
  id: string;
  pet_id: string;
  user_id?: string;
  plan_data: {
    weekly_plan: {
      [key: string]: {
        breakfast: string;
        lunch: string;
        dinner: string;
        treats: string;
        notes: string;
      };
    };
    nutritional_guidelines: string[];
    feeding_schedule: string;
    portion_sizes: string;
    special_considerations: string[];
  };
  created_at: string;
}

// AI response structure
export interface AIResponse {
  response: string;
  reasoning: string;
}

// Pet mood scenario for the educational game
export interface PetMoodScenario {
  scenario: string;
  correct_mood: string;
  mood_options: string[];
  explanation: string;
}