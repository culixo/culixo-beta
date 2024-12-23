// src/components/drafts/DraftsList.tsx
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { DraftState } from '@/types/post-recipe/recipe'
import { DraftCard } from './DraftCard'

interface DraftsListProps {
  drafts: DraftState[]
  onSelectDraft: (draftId: string) => void
  onDeleteDraft: (draftId: string) => void
  onDuplicateDraft: (draftId: string) => void
}

export function DraftsList({
  drafts,
  onSelectDraft,
  onDeleteDraft,
  onDuplicateDraft
}: DraftsListProps) {
  const [sortBy, setSortBy] = useState<string>('lastModified')
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDrafts = drafts
    .filter(draft => {
      if (searchTerm) {
        // Safely access the title and handle undefined case
        const title = draft.data.basicInfo.title || 'Untitled Recipe'
        return title.toLowerCase().includes(searchTerm.toLowerCase())
      }
      switch (filter) {
        case 'recent':
          return (new Date().getTime() - new Date(draft.metadata.modifiedAt).getTime()) < 86400000
        case 'almostDone':
          return draft.metadata.completionPercentage >= 80
        case 'justStarted':
          return draft.metadata.completionPercentage <= 20
        default:
          return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          const titleA = a.data.basicInfo.title || 'Untitled Recipe'
          const titleB = b.data.basicInfo.title || 'Untitled Recipe'
          return titleA.localeCompare(titleB)
        case 'progress':
          return b.metadata.completionPercentage - a.metadata.completionPercentage
        default:
          return new Date(b.metadata.modifiedAt).getTime() - new Date(a.metadata.modifiedAt).getTime()
      }
    })

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          placeholder="Search drafts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-64"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastModified">Last Modified</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Drafts</SelectItem>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="almostDone">Almost Done</SelectItem>
            <SelectItem value="justStarted">Just Started</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDrafts.map((draft) => (
          <DraftCard
            key={draft.id}
            draft={draft}
            onSelect={() => onSelectDraft(draft.id)}
            onDelete={() => onDeleteDraft(draft.id)}
            onDuplicate={() => onDuplicateDraft(draft.id)}
          />
        ))}
      </div>
    </div>
  )
}