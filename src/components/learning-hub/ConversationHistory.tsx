// src/components/learning-hub/ConversationHistory.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Trash2, Plus, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Session {
  id: string
  title: string
  category: string | null
  messageCount: number
  updatedAt: string
  rating: number | null
}

interface ConversationHistoryProps {
  currentSessionId?: string
  onNewChat: () => void
}

export function ConversationHistory({ 
  currentSessionId, 
  onNewChat 
}: ConversationHistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/learning-hub/sessions')
      const data = await response.json()
      
      if (data.success) {
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Delete this conversation?')) return

    setDeletingId(sessionId)
    try {
      const response = await fetch(`/api/learning-hub/sessions/${sessionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId))
        
        // If deleting current session, redirect to new chat
        if (sessionId === currentSessionId) {
          onNewChat()
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      ACADEMIC: 'bg-blue-100 text-blue-700',
      CAREER: 'bg-green-100 text-green-700',
      PERSONAL_DEV: 'bg-purple-100 text-purple-700',
      COLLEGE_PREP: 'bg-yellow-100 text-yellow-700',
      EMOTIONAL: 'bg-pink-100 text-pink-700',
      TECHNICAL: 'bg-gray-100 text-gray-700',
    }
    return colors[category || ''] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={onNewChat}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Conversation
      </Button>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-600 px-2">
          Recent Conversations
        </h3>
        
        {sessions.length === 0 ? (
          <Card className="p-6 text-center text-sm text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            No conversations yet. Start your first chat!
          </Card>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/learning-hub/${session.id}`}
                className={`block p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                  session.id === currentSessionId
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {session.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {session.category && (
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getCategoryColor(session.category)}`}>
                          {session.category.replace('_', ' ')}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {session.messageCount} messages
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(session.id, e)}
                    disabled={deletingId === session.id}
                    className="flex-shrink-0 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    {deletingId === session.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
