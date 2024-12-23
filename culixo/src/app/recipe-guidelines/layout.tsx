// src/app/recipe-guidelines/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recipe Guidelines | Culixo",
  description: "Learn how to share your recipes effectively on Culixo - Your Community Recipe Platform",
}

export default function RecipeGuidelinesLayout({
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