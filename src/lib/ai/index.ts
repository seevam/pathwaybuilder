import OpenAI from 'openai';

// Initialize OpenAI (required for idea generation)
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
});
