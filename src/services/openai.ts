import type { AIResponse } from '../types';

// OpenAI API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Create the initial greeting message for a new pet
export const createPetPersona = async (petInfo: string, breed: string, type: string, petName: string): Promise<string> => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return 'I need to get to know you better before we can chat!';
  }

  const systemPrompt = `You are a ${breed || type} named ${petName} with the personality and characteristics typical of a ${breed || type}. Always respond as if you are this specific pet, with appropriate personality traits, needs, and behaviors. Be playful, loving, and authentic to your breed. Keep responses conversational and pet-like. Your name is ${petName}.

Pet information: ${petInfo}`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Introduce yourself to your new human companion! Your name is ${petName}.`
          }
        ],
        max_tokens: 150,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create pet persona');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Woof! I'm excited to meet you!";
  } catch (error) {
    console.error('Error creating pet persona:', error);
    return "Hi there! I'm so happy to meet you! Let's be best friends! 🐾";
  }
};

// Handle ongoing chat conversations with the pet
export const chatWithPet = async (
  message: string,
  petInfo: string,
  breed: string,
  type: string,
  petName: string,
  chatHistory: Array<{ role: string; content: string }>
): Promise<AIResponse> => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return {
      response: 'Woof! I need my human to set up my voice first!',
      reasoning: 'API key not configured'
    };
  }

  const systemPrompt = `You are a ${breed || type} named ${petName} with the following characteristics: ${petInfo}. Always respond as this specific pet with authentic personality traits. Be conversational, loving, and true to your breed's nature. Keep responses under 100 words. Your name is ${petName} and you should refer to yourself by this name when appropriate.

You must respond with ONLY a valid JSON object in this exact format:
{"response": "your pet response here", "reasoning": "brief explanation of why you responded this way based on your breed/personality"}

Do not include any text before or after the JSON object.`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 200,
        temperature: 0.4,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to chat with pet');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{"response": "Woof! I didn\'t quite catch that!", "reasoning": "No response received from AI"}';
    
    console.log('Raw OpenAI response:', content);
    
    try {
      // Clean the content in case there are any extra characters
      const cleanContent = content.trim();
      const parsed = JSON.parse(cleanContent);
      
      // Validate that we have the expected fields
      if (!parsed.response || !parsed.reasoning) {
        throw new Error('Missing required fields in response');
      }
      
      return {
        response: parsed.response || "Woof! I didn't quite catch that!",
        reasoning: parsed.reasoning || "No reasoning provided"
      } as AIResponse;
    } catch (parseError) {
      console.error('JSON parsing error:', parseError, 'Content:', content);
      // Fallback if JSON parsing fails
      return {
        response: content || "Woof! I didn't quite catch that!",
        reasoning: "The AI response couldn't be parsed properly. This might be a temporary issue."
      } as AIResponse;
    }
  } catch (error) {
    console.error('Error chatting with pet:', error);
    return {
      response: "I'm a bit sleepy right now, can you try again? 🐾",
      reasoning: "An error occurred while processing your message. Please try again."
    } as AIResponse;
  }
};

export const generateDietPlan = async (
  petInfo: string,
  breed: string,
  type: string,
  petName: string
): Promise<any> => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return null;
  }

  const systemPrompt = `You are a professional veterinary nutritionist. Create a comprehensive weekly diet plan for a ${breed || type} named ${petName}.

Pet information: ${petInfo}

Provide a detailed JSON response with this exact structure:
{
  "weekly_plan": {
    "Monday": {
      "breakfast": "specific meal description with portions",
      "lunch": "specific meal description with portions", 
      "dinner": "specific meal description with portions",
      "treats": "healthy treat options",
      "notes": "any special considerations for this day"
    },
    ... (continue for all 7 days)
  },
  "nutritional_guidelines": ["guideline 1", "guideline 2", ...],
  "feeding_schedule": "recommended feeding times and frequency",
  "portion_sizes": "general portion size guidelines based on weight/age",
  "special_considerations": ["consideration 1", "consideration 2", ...]
}

Make it breed-specific, healthy, and practical for pet owners.`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Create a weekly diet plan for my ${breed || type} named ${petName}.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate diet plan');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating diet plan:', error);
    return null;
  }
};

export const generatePetMoodScenario = async (
  petInfo: string,
  breed: string,
  type: string,
  petName: string
): Promise<any> => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return null;
  }

  const systemPrompt = `You are a pet behavior expert. Create an educational mood reading scenario for a ${breed || type} named ${petName}.

Pet information: ${petInfo}

Generate a JSON response with this exact structure:
{
  "scenario": "A detailed scenario describing the pet's behavior and body language",
  "correct_mood": "the correct mood/emotion the pet is experiencing",
  "mood_options": ["correct mood", "incorrect option 1", "incorrect option 2", "incorrect option 3"],
  "explanation": "detailed explanation of why this mood is correct, including breed-specific behaviors and body language cues"
}

Make it educational and breed-specific. The scenario should be realistic and help users learn to read their pet's emotions.`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Create a mood reading scenario for my ${breed || type} named ${petName}.`
          }
        ],
        max_tokens: 500,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate mood scenario');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating mood scenario:', error);
    return null;
  }
};