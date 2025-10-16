// src/components/learning-hub/ChatInterface.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { QuickActions } from './QuickActions'
import { SuggestedQuestions } from './SuggestedQuestions'
import { ModeSelector } from './ModeSelector'
import { VoiceInterface } from './VoiceInterface'
import { useToast } from '@/components/ui/use-toast'

interface Message {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
  category?: string
  createdAt: Date
}

interface ChatInterfaceProps {
  sessionId?: string
  initialMessages?: Message[]
  userName?: string
}

export function ChatInterface({ 
  sessionId: initialSessionId, 
  initialMessages = [],
  userName = 'there'
}: ChatInterfaceProps) {
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Check voice support
  const [voiceSupported, setVoiceSupported] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVoice = !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition
      const hasTTS = !!window.speechSynthesis
      setVoiceSupported(hasVoice && hasTTS)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show welcome message if no messages
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'ASSISTANT',
        content: `Hi ${userName}! 👋 I'm Sage, your AI learning mentor. I'm here to help you with:

• 📚 **Academic questions** - homework help, concept clarification
• 🎯 **Career guidance** - explore paths that match your interests
• 📝 **Study strategies** - time management and learning techniques
• 🎓 **College prep** - applications, essays, and planning
• 💪 **Personal support** - motivation, goal-setting, and encouragement

What would you like to work on today?`,
        createdAt: new Date(),
      }
      setMessages([welcomeMessage])
      setSuggestedQuestions([
        'Help me understand a concept from class',
        'What careers match my interests?',
        'How can I improve my study habits?',
        'Can you review my essay?'
      ])
    }
  }, [userName])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'USER',
      content: input.trim(),
      createdAt: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setSuggestedQuestions([])

    try {
      const response = await fetch('/api/learning-hub/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          sessionId,
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send message')
      }

      const data = await response.json()

      if (!sessionId) {
        setSessionId(data.sessionId)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: data.response,
        category: data.category,
        createdAt: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])
      
      if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
        setSuggestedQuestions(data.suggestedQuestions)
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    textareaRef.current?.focus()
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceMessage = (userMessage: string, aiResponse: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'USER',
      content: userMessage,
      createdAt: new Date(),
    }
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ASSISTANT',
      content: aiResponse,
      createdAt: new Date(),
    }
    setMessages(prev => [...prev, userMsg, aiMsg])
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      {/* Mode Selector Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎓</div>
          <div>
            <h2 className="font-bold text-gray-900">Sage - Your AI Mentor</h2>
            <p className="text-xs text-gray-600">
              {mode === 'text' ? 'Type your questions below' : 'Speak naturally to get help'}
            </p>
          </div>
        </div>
        <ModeSelector
          mode={mode}
          onModeChange={setMode}
          voiceSupported={voiceSupported}
          disabled={isLoading}
        />
      </div>

      {/* Content Area - Changes based on mode */}
      {mode === 'voice' ? (
        <div className="flex-1 overflow-y-auto">
          <VoiceInterface
            sessionId={sessionId}
            userName={userName}
            onNewMessage={handleVoiceMessage}
          />
        </div>
      ) : (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">{/* ... rest of existing text mode JSX ... */}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.createdAt}
            category={message.category}
          />
        ))}

        {isLoading && <TypingIndicator />}

        {!isLoading && messages.length > 1 && (
          <QuickActions 
            onActionClick={handleQuickAction}
            disabled={isLoading}
          />
        )}

        {!isLoading && suggestedQuestions.length > 0 && (
          <SuggestedQuestions 
            questions={suggestedQuestions}
            onQuestionClick={handleSuggestedQuestion}
            disabled={isLoading}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
            className="min-h-[60px] max-h-[200px] resize-none border-2 border-purple-200 focus:border-purple-400"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 I'm here to help you learn, not do your homework for you!
        </p>
      </div>
      </>
      )}
    </div>
  )
}
