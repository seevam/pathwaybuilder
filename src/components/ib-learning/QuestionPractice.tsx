'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Lightbulb,
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  questionType: string;
  difficulty: string;
  options: Record<string, string> | null;
  correctAnswer: string;
  explanation: string;
}

interface Evaluation {
  isCorrect: boolean;
  score: number;
  feedback: string;
  suggestions: string[];
}

interface QuestionPracticeProps {
  questions: Question[];
  userId: string;
  subjectName: string;
}

export function QuestionPractice({ questions, userId, subjectName }: QuestionPracticeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isGettingHint, setIsGettingHint] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ib-learning/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          userAnswer,
          questionId: currentQuestion.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate answer');
      }

      const result = await response.json();
      setEvaluation(result);

      if (result.isCorrect) {
        toast.success(`Great job! Score: ${result.score}/100`);
      } else {
        toast.info(`Score: ${result.score}/100`);
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      toast.error('Failed to evaluate answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage: Message = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatting(true);

    try {
      const response = await fetch('/api/ib-learning/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          question: currentQuestion,
          userAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setChatMessages([...updatedMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsChatting(false);
    }
  };

  const handleGetHint = async () => {
    setIsGettingHint(true);

    try {
      const response = await fetch('/api/ib-learning/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          conversationHistory: chatMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get hint');
      }

      const data = await response.json();
      toast.info(data.hint, { duration: 8000 });
    } catch (error) {
      console.error('Error getting hint:', error);
      toast.error('Failed to get hint. Please try again.');
    } finally {
      setIsGettingHint(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setEvaluation(null);
      setChatMessages([]);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer('');
      setEvaluation(null);
      setChatMessages([]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY':
        return 'bg-green-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'HARD':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Question Area */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardDescription>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
            </div>
            <CardTitle>{currentQuestion.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Content */}
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{currentQuestion.content}</p>
            </div>

            {/* Multiple Choice Options */}
            {currentQuestion.questionType === 'MULTIPLE_CHOICE' && currentQuestion.options && (
              <div className="space-y-2">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={key}
                      checked={userAnswer === key}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">
                      <strong>{key}.</strong> {value}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Text Answer Input */}
            {currentQuestion.questionType !== 'MULTIPLE_CHOICE' && (
              <div>
                <Textarea
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={6}
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  'Submit Answer'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleGetHint}
                disabled={isGettingHint}
              >
                {isGettingHint ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="mr-2 h-4 w-4" />
                )}
                Get Hint
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {showChat ? 'Hide' : 'Show'} AI Tutor
              </Button>
            </div>

            {/* Evaluation Results */}
            {evaluation && (
              <Card className={evaluation.isCorrect ? 'border-green-500' : 'border-yellow-500'}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {evaluation.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <CardTitle className="text-lg">
                      Score: {evaluation.score}/100
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Feedback:</h4>
                    <p className="text-sm">{evaluation.feedback}</p>
                  </div>

                  {evaluation.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Suggestions:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!evaluation.isCorrect && (
                    <div>
                      <h4 className="font-semibold mb-2">Correct Answer:</h4>
                      <p className="text-sm">{currentQuestion.correctAnswer}</p>
                      <h4 className="font-semibold mt-3 mb-2">Explanation:</h4>
                      <p className="text-sm">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Sidebar */}
      {showChat && (
        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>AI Tutor</CardTitle>
              <CardDescription>Ask questions, get guidance</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Start a conversation with the AI tutor!
                      <br />
                      Ask for help, clarification, or guidance.
                    </p>
                  ) : (
                    chatMessages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {isChatting && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <Separator />
              <div className="p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask the AI tutor..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={2}
                    disabled={isChatting}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isChatting}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
