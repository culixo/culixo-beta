// src/app/profile/[id]/layout.tsx
import { ProfileLayout } from "@/components/profile/ProfileLayout";

interface ProfilePageLayoutProps {
  children: React.ReactNode
  params: {
    id: string
  }
}

export default function ProfilePageLayout({
  children,
  params,
}: ProfilePageLayoutProps) {
  return (
    <ProfileLayout userId={params.id}>
      {children}
    </ProfileLayout>
  );
}