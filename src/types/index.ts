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

export interface ChatMessage {
  id: string;
  pet_id: string;
  user_id?: string;
  message: string;
  is_from_pet: boolean;
  reasoning?: string;
  created_at: string;
}

export interface GeminiResponse {
  type: string;
  breed?: string;
  description: string;
  characteristics: string[];
  care_tips: string[];
}

export interface AppState {
  currentPet: Pet | null;
  pets: Pet[];
  chatMessages: ChatMessage[];
  isLoading: boolean;
}

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

export interface AIResponse {
  response: string;
  reasoning: string;
}

export interface PetMoodScenario {
  scenario: string;
  correct_mood: string;
  mood_options: string[];
  explanation: string;
}