// src/app/profile/[id]/page.tsx
import { PostedRecipes } from '@/components/profile/PostedRecipes';

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return <PostedRecipes userId={params.id} />;
}