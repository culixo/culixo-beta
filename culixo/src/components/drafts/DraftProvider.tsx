// src/components/drafts/DraftProvider.tsx
import { createContext, useContext, ReactNode } from 'react'
import { DraftState, DraftStatus } from '@/types/post-recipe/recipe'
import { useDraftAutosave } from '@/lib/hooks/useDraftAutosave'

interface DraftContextType {
  draftState: DraftState
  updateDraft: (updates: Partial<DraftState>) => void
  status: DraftStatus
}

const DraftContext = createContext<DraftContextType | null>(null)

export function DraftProvider({
  children,
  draftId,
  initialData,
  onSave
}: {
  children: ReactNode
  draftId: string
  initialData: DraftState
  onSave: (data: DraftState) => Promise<void>
}) {
  const { draftState, updateDraft, status } = useDraftAutosave(draftId, initialData, onSave)

  return (
    <DraftContext.Provider value={{ draftState, updateDraft, status }}>
      {children}
    </DraftContext.Provider>
  )
}

export const useDraft = () => {
  const context = useContext(DraftContext)
  if (!context) throw new Error('useDraft must be used within a DraftProvider')
  return context
}