// src/app/community-guidelines/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Community Guidelines | Culixo",
  description: "Guidelines for participating in the Culixo cooking community",
}

export default function CommunityGuidelinesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="flex-1">{children}</main>
    </>
  )
}