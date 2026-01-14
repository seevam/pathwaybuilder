import { openai } from './index';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  questionType: string;
  difficulty: string;
  correctAnswer: string;
  explanation: string;
  options?: Record<string, string>;
}

export interface Evaluation {
  isCorrect: boolean;
  score: number;
  feedback: string;
  suggestions: string[];
}

/**
 * Get AI tutor response using Socratic method
 */
export async function getAITutorResponse(
  messages: Message[],
  question: Question,
  userAnswer?: string
): Promise<string> {
  const systemPrompt = `You are an AI tutor for IB (International Baccalaureate) students. Your role is to guide students to discover answers themselves using the Socratic method.

Key principles:
1. NEVER give direct answers
2. Ask thought-provoking questions
3. Break down complex problems into smaller steps
4. Acknowledge correct reasoning
5. Gently redirect misconceptions
6. Use the student's current answer to guide your questions
7. Be encouraging and supportive
8. Adapt your language to IB level (ages 16-19)

When a student asks for help:
- Ask what they already know about the topic
- Guide them to identify relevant concepts
- Help them make connections
- Encourage them to try an approach

Current Question: ${question.title}
${question.content}

${userAnswer ? `Student's Current Answer: ${userAnswer}` : ''}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
  } catch (error) {
    console.error('Error in getAITutorResponse:', error);
    throw new Error('Failed to get AI tutor response');
  }
}

/**
 * Evaluate student answer
 */
export async function evaluateAnswer(
  question: Question,
  userAnswer: string
): Promise<Evaluation> {
  const evaluationPrompt = `You are an expert IB examiner evaluating a student's answer. Provide a fair and constructive evaluation.

Question Type: ${question.questionType}
Difficulty: ${question.difficulty}
Question: ${question.content}
${question.options ? `Options: ${JSON.stringify(question.options)}` : ''}
Correct Answer: ${question.correctAnswer}
Explanation: ${question.explanation}

Student's Answer: ${userAnswer}

Please evaluate this answer and respond with a JSON object containing:
{
  "isCorrect": boolean,
  "score": number (0-100),
  "feedback": "detailed feedback string",
  "suggestions": ["array", "of", "improvement suggestions"]
}

For multiple choice: Check exact match only.
For short answer: Check for key concepts and semantic similarity.
For essay: Evaluate structure, arguments, evidence, coherence.
For calculation: Check methodology and final answer.

Be constructive and encouraging in your feedback.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: evaluationPrompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // Ensure all required fields are present
    return {
      isCorrect: result.isCorrect ?? false,
      score: result.score ?? 0,
      feedback: result.feedback || 'Unable to provide feedback at this time.',
      suggestions: result.suggestions || [],
    };
  } catch (error) {
    console.error('Error in evaluateAnswer:', error);
    throw new Error('Failed to evaluate answer');
  }
}

/**
 * Generate contextual hint
 */
export async function generateHint(
  question: Question,
  conversationHistory: Message[]
): Promise<string> {
  const hintPrompt = `You are an AI tutor helping an IB student with a question. Generate a helpful hint that guides without giving away the answer.

Question: ${question.title}
${question.content}

Conversation History:
${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join('\n')}

The hint should:
- Guide the student toward the solution without revealing it
- Be progressive (first hint: general approach, later hints: more specific)
- Reference concepts they should know at IB level
- Be encouraging and supportive
- Be concise (2-3 sentences max)

Generate a single hint that helps the student progress:`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: hintPrompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || 'Think about the fundamental concepts related to this topic. What do you already know that might help?';
  } catch (error) {
    console.error('Error in generateHint:', error);
    throw new Error('Failed to generate hint');
  }
}
