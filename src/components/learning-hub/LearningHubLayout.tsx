// src/components/learning-hub/LearningHubLayout.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { ChatInterface } from './ChatInterface'
import { ConversationHistory } from './ConversationHistory'

interface LearningHubLayoutProps {
  userName: string
  sessionId?: string
  initialMessages?: any[]
}

export function LearningHubLayout({ 
  userName, 
  sessionId,
  initialMessages 
}: LearningHubLayoutProps) {
  const [showSidebar, setShowSidebar] = useState(false)
  const router = useRouter()

  const handleNewChat = () => {
    router.push('/learning-hub')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  🎓 AI Learning Hub
                </h1>
                <p className="text-sm text-gray-600">Your 24/7 learning companion</p>
              </div>
            </div>
            
            {/* Mobile menu toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Sidebar - History */}
          <div className={`md:col-span-1 ${showSidebar ? 'block' : 'hidden md:block'}`}>
            <Card className="p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <ConversationHistory 
                currentSessionId={sessionId}
                onNewChat={handleNewChat}
              />
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="md:col-span-3">
            <Card className="shadow-xl border-2 border-purple-200">
              <ChatInterface 
                userName={userName}
                sessionId={sessionId}
                initialMessages={initialMessages}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="container mx-auto px-4 pb-6">
        <Card className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-purple-700">✅</span>
              <span className="text-gray-700">Step-by-step explanations</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-semibold text-purple-700">🎯</span>
              <span className="text-gray-700">Personalized to your profile</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="font-semibold text-purple-700">🔒</span>
              <span className="text-gray-700">Private & secure</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
