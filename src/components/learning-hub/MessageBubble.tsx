// src/components/learning-hub/MessageBubble.tsx
'use client'

import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'

interface MessageBubbleProps {
  role: 'USER' | 'ASSISTANT'
  content: string
  timestamp: Date
  category?: string
}

export function MessageBubble({ role, content, timestamp, category }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = role === 'USER'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1 ml-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="text-xs font-semibold text-gray-600">Sage</span>
          </div>
        )}
        
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
              : 'bg-white border-2 border-purple-200 text-gray-900'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  code: ({node, inline, ...props}: any) => 
                    inline ? (
                      <code className="bg-purple-100 px-1 py-0.5 rounded text-purple-700 font-mono text-xs" {...props} />
                    ) : (
                      <code className="block bg-gray-100 p-2 rounded font-mono text-xs overflow-x-auto" {...props} />
                    ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}

          {!isUser && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-100">
              <span className="text-xs text-gray-500">
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 text-xs"
              >
                {copied ? (
                  <><Check className="w-3 h-3 mr-1" /> Copied</>
                ) : (
                  <><Copy className="w-3 h-3 mr-1" /> Copy</>
                )}
              </Button>
            </div>
          )}
        </div>

        {isUser && (
          <div className="text-xs text-gray-500 mt-1 mr-2 text-right">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}

        {category && !isUser && (
          <div className="ml-1 mt-2">
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
              {category.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
