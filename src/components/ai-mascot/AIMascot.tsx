'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Send, Sparkles, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIMascotProps {
  inSidebar?: boolean
  isCollapsed?: boolean
}

const MASCOT_GREETINGS = [
  "Hi! I'm Pathway Pat, your career discovery guide! 🎓",
  "Hey there! Need help navigating your journey? 🗺️",
  "Hello! Ready to build your future? Let me help! 🚀"
]

export function AIMascot({ inSidebar = false, isCollapsed = false }: AIMascotProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when first opened
      const greeting = MASCOT_GREETINGS[Math.floor(Math.random() * MASCOT_GREETINGS.length)]
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: greeting + '\n\nI can help you with:\n• Understanding how to use Pathway Builder\n• Navigating modules and activities\n• Tips for your passion projects\n• Career exploration guidance\n\nWhat would you like to know?',
        timestamp: new Date()
      }])
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-mascot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          conversationHistory: messages.slice(-6) // Last 3 exchanges
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Mascot Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={inSidebar ? 'w-full' : 'fixed bottom-6 right-6 z-50'}
          >
            {inSidebar ? (
              /* Sidebar Button */
              <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                  'w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg relative group',
                  isCollapsed ? 'h-12 px-0' : 'h-12'
                )}
              >
                <div className="flex items-center gap-2 justify-center">
                  <div className="text-xl">🎓</div>
                  {!isCollapsed && <span className="font-semibold">Ask Pathway Pat</span>}
                  <Sparkles className={cn(
                    'w-4 h-4 text-yellow-300 animate-pulse',
                    isCollapsed && 'absolute -top-1 -right-1'
                  )} />
                </div>
              </Button>
            ) : (
              /* Floating Button */
              <div>
                <Button
                  onClick={() => setIsOpen(true)}
                  size="lg"
                  className="h-16 w-16 rounded-full shadow-lg bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 relative group"
                >
                  <div className="text-3xl">🎓</div>
                  <div className="absolute inset-0 rounded-full bg-purple-400 opacity-0 group-hover:opacity-20 animate-ping" />
                  <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
                </Button>

                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute bottom-0 right-20 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
                >
                  Need help? Ask me anything!
                  <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-900" />
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl overflow-hidden border-2 border-purple-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎓</div>
                    <div>
                      <h3 className="font-bold text-lg">Pathway Pat</h3>
                      <p className="text-xs text-purple-100">Your AI Career Guide</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-purple-50 to-white space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white border-2 border-purple-200 text-gray-900'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="text-xs text-purple-600 font-semibold mb-1">
                          🎓 Pathway Pat
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-purple-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border-2 border-purple-200 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t-2 border-purple-100">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 border-2 border-purple-200 focus:border-purple-400"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  💡 Press Enter to send
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
