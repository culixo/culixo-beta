// app/profile-settings/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile Settings | Culixo",
  description: "Manage your Culixo account settings, privacy, notifications, and cooking preferences.",
  openGraph: {
    title: "Profile Settings | Culixo",
    description: "Manage your Culixo account settings, privacy, notifications, and cooking preferences.",
    type: "website",
    url: "https://culixo.com/profile-settings",
    siteName: "Culixo",
  },
  robots: {
    index: false, // Don't index settings pages for privacy
    follow: true,
  },
}

export default function ProfileSettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}