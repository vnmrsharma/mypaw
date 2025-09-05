# MyPaw 🐾

**Talk to your pet to know what's best for them**

MyPaw is an AI-powered pet companion app that bridges the communication gap between pet owners and their furry friends. By combining advanced AI with pet-specific knowledge, MyPaw helps owners understand their pets' needs, behaviors, and health requirements.

## The Problem We're Solving

Over 50% of pet owners lack sufficient knowledge about their pet's welfare, nutrition, and behavior, often relying on outdated or conflicting information. This gap leads to improper feeding, delayed care, and preventable health issues, causing many rushed emergency vet visits. Nearly 43% of cats in the UK have not received recent veterinary care, reflecting owners' difficulty in recognizing needs.

MyPaw addresses this critical knowledge gap by enabling personalized, breed-specific communication and tailored diet plans, empowering owners to make informed decisions and improve pet health.

## Key Features

- **AI Pet Communication**: Chat with your pet's AI persona based on their breed and personality
- **Smart Pet Identification**: Upload a photo to automatically identify your pet's breed and characteristics
- **Personalized Diet Plans**: Get weekly meal plans tailored to your pet's specific needs
- **PawMood: Mood Recognition Game**: Learn to read your pet's emotions through interactive scenarios
- **Breed-Specific Insights**: Receive care tips and advice based on your pet's breed

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI Services**: OpenAI GPT, Google Gemini
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenAI API key
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mypaw
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration files in the `supabase/migrations/` folder
   - Enable Row Level Security (RLS) on all tables

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
├── services/           # API integrations
├── types/              # TypeScript definitions
└── App.tsx            # Main application component
```
## Contributing

Feel free to submit issues and enhancement requests!

---

*Made with ❤️ for pet lovers everywhere*
