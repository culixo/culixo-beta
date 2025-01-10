// components/profile-settings/SettingsSidebar.tsx
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { 
  Settings,
  User, 
  Bell, 
  Shield, 
  ChefHat,
  ChevronLeft,
  ChevronRight,
  UserCog
} from "lucide-react"

const settingsNavItems = [
  {
    title: "Account",
    href: "account",
    icon: UserCog,
    exact: true
  },
  {
    title: "Profile",
    href: "profile",
    icon: User
  },
  {
    title: "Notifications",
    href: "notifications",
    icon: Bell
  },
  {
    title: "Privacy & Security",
    href: "privacy",
    icon: Shield
  },
  {
    title: "Cooking Preferences",
    href: "cooking",
    icon: ChefHat
  }
]

export function SettingsSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentTab = searchParams.get('tab') || 'account'

  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header with collapse button */}
      <div className="h-16 flex items-center justify-between px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-4 min-w-0">
            <Settings className="h-4 w-4 flex-shrink-0 text-muted-foreground/70" />
            <span className="text-sm text-muted-foreground/70 truncate">
              Settings /{" "}
              {settingsNavItems.find((item) => item.href === currentTab)
                ?.title || "Account"}
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground/70 ml-2 flex-shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {settingsNavItems.map((item) => {
            const isActive = currentTab === item.href;

            return (
              <button
                key={item.href}
                onClick={() =>
                  router.push(`/profile-settings?tab=${item.href}`)
                }
                className={cn(
                  "w-full flex items-center gap-x-4 px-4 py-3 rounded-xl transition-all duration-200",
                  "hover:bg-white/5",
                  isCollapsed && "justify-center px-3",
                  isActive
                    ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                    : "text-muted-foreground/90 hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0",
                    isActive ? "h-5 w-5" : "h-5 w-5"
                  )}
                />
                {!isCollapsed && (
                  <span
                    className={cn(
                      "text-[15px] font-medium",
                      isActive && "font-semibold"
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}