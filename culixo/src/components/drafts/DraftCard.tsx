// src/components/drafts/DraftCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DraftState } from '@/types/post-recipe/recipe'
import { DraftStatus } from './DraftStatus'

interface DraftCardProps {
  draft: DraftState
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function DraftCard({ draft, onSelect, onDelete, onDuplicate }: DraftCardProps) {
  const formattedDate = new Date(draft.metadata.modifiedAt).toLocaleDateString()
  const title = draft.data.basicInfo.title || 'Untitled Recipe'
  
  return (
    <Card className="group transition-all hover:border-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold leading-none tracking-tight">
          {title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSelect}>
              <Edit2 className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Last modified: {formattedDate}
          </div>
          <DraftStatus status={draft.status} />
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${draft.metadata.completionPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          className="w-full"
          onClick={onSelect}
        >
          Continue Editing
        </Button>
      </CardFooter>
    </Card>
  )
}