/**
 * Skeleton Component
 * 
 * Loading placeholder that mirrors final layout.
 * Follows Seshio design principles: calm, no shimmer, subtle pulse.
 */

import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  // Extends HTMLDivElement attributes
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/50',
        className
      )}
      {...props}
    />
  )
}

/**
 * Notebook Card Skeleton
 * Mirrors the NotebookList card layout
 */
export function NotebookCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

/**
 * Archetype Option Skeleton
 * Mirrors the ArchetypeSelector option layout
 */
export function ArchetypeOptionSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

/**
 * Material List Item Skeleton
 * Mirrors the MaterialList item layout
 */
export function MaterialItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  )
}

/**
 * Message Skeleton
 * Mirrors chat message layout
 */
export function MessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={cn('space-y-2', isUser ? 'ml-auto max-w-[80%]' : 'max-w-[80%]')}>
      <Skeleton className="h-4 w-20" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}

/**
 * Question Skeleton
 * Mirrors Study Mode question layout
 */
export function QuestionSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}

