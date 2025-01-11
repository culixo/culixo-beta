// src/app/profile/[id]/page.tsx
import { PostedRecipes } from '@/components/profile/PostedRecipes';

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Make the component async and await the params
  const { id } = await params;
  return <PostedRecipes userId={id} />;
}