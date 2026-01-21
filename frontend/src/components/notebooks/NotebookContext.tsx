/**
 * Notebook Context Component
 * 
 * Main view for notebook context showing materials and conversations.
 * Requirements: 11.1, 11.2, 11.3, 11.6
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, MessageSquare, Search as SearchIcon } from 'lucide-react'
import { MaterialList, Material } from './MaterialList'
import { ConversationHistory, Conversation } from './ConversationHistory'
import { NotebookSearch, SearchResult } from './NotebookSearch'

type TabType = 'materials' | 'conversations' | 'search'

interface NotebookContextProps {
  materials: Material[]
  conversations: Conversation[]
  searchResults: SearchResult[]
  searchLoading: boolean
  onMaterialSelect: (material: Material) => void
  onMaterialDelete: (material: Material) => void
  onSearch: (query: string) => void
}

export function NotebookContext({
  materials,
  conversations,
  searchResults,
  searchLoading,
  onMaterialSelect,
  onMaterialDelete,
  onSearch,
}: NotebookContextProps) {
  const [activeTab, setActiveTab] = useState<TabType>('materials')

  const tabs = [
    { id: 'materials' as TabType, label: 'Materials', icon: FileText, count: materials.length },
    { id: 'conversations' as TabType, label: 'Conversations', icon: MessageSquare, count: conversations.length },
    { id: 'search' as TabType, label: 'Search', icon: SearchIcon },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-seshio ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'materials' && (
            <MaterialList
              materials={materials}
              onSelect={onMaterialSelect}
              onDelete={onMaterialDelete}
            />
          )}

          {activeTab === 'conversations' && (
            <ConversationHistory conversations={conversations} />
          )}

          {activeTab === 'search' && (
            <NotebookSearch
              onSearch={onSearch}
              results={searchResults}
              loading={searchLoading}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}
