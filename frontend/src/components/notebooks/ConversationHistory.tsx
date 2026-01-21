/**
 * Conversation History Component
 * 
 * Displays conversation history in a notebook.
 * Requirements: 11.2
 */

'use client'

import { motion } from 'framer-motion'
import { User, Bot } from 'lucide-react'

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  grounding_score?: number
  created_at: string
}

export interface Citation {
  chunk_id: string
  material_id: string
  filename: string
  content: string
  metadata: Record<string, any>
}

export interface Conversation {
  id: string
  notebook_id: string
  created_at: string
  messages: Message[]
}

interface ConversationHistoryProps {
  conversations: Conversation[]
}

export function ConversationHistory({ conversations }: ConversationHistoryProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (conversations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 space-y-4"
      >
        <div className="text-5xl">💬</div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-muted-foreground">
            No conversations yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Start asking questions to create conversation history
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {conversations.map((conversation, convIndex) => (
        <motion.div
          key={conversation.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: convIndex * 0.05 }}
          className="space-y-4"
        >
          {/* Conversation header */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Conversation</span>
            <span>•</span>
            <span>{formatDate(conversation.created_at)}</span>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {conversation.messages.map((message, msgIndex) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-xs opacity-70">
                        {message.citations.length} source{message.citations.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.created_at)}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
