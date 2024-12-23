// src/app/help-support/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help & Support | Culixo",
  description: "Get help and support for using Culixo - Your Community Recipe Platform",
}

export default function HelpSupportLayout({
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