// app/profile-settings/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SettingsLayout } from "@/components/profile-settings/SettingsLayout"
import { SettingsAccount } from "@/components/profile-settings/SettingsAccount"
import { SettingsProfile } from "@/components/profile-settings/SettingsProfile"
import { SettingsNotifications } from "@/components/profile-settings/SettingsNotifications"
import { SettingsPrivacy } from "@/components/profile-settings/SettingsPrivacy"
import { SettingsCooking } from "@/components/profile-settings/SettingsCooking"
import { useAuth } from "@/hooks/useAuth"

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const searchParams = useSearchParams()
  
  // Correctly access the tab parameter
  const currentTab = searchParams.get('tab') || 'account'

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/profile-settings')
    }
  }, [isAuthenticated, router])

  // Show nothing while checking authentication
  if (!isAuthenticated || !user) {
    return null
  }

  // Render component based on current tab
  const renderSettingsContent = () => {
    switch (currentTab) {
      case 'profile':
        return <SettingsProfile />
      case 'notifications':
        return <SettingsNotifications />
      case 'privacy':
        return <SettingsPrivacy />
      case 'cooking':
        return <SettingsCooking />
      default:
        return <SettingsAccount />
    }
  }

  return (
    <SettingsLayout>
      <div 
        key={currentTab}
        className="animate-fade-in-up"
      >
        {renderSettingsContent()}
      </div>
    </SettingsLayout>
  )
}