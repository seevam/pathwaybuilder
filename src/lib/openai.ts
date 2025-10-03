import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateReflectionInsight(
  prompt: string,
  userResponse: string
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a supportive career counselor helping high school students 
        discover their interests and strengths. Provide encouraging, specific insights 
        based on their reflections. Keep responses under 150 words.`
      },
      {
        role: "user",
        content: `Prompt: ${prompt}\n\nStudent Response: ${userResponse}\n\nProvide 
        an encouraging insight that helps them understand themselves better.`
      }
    ],
    temperature: 0.7,
    max_tokens: 250,
  })

  return completion.choices[0].message.content || ''
}
