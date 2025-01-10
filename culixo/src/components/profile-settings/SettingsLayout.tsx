// components/profile-settings/SettingsLayout.tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { SettingsSidebar } from "./SettingsSidebar"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="h-screen overflow-hidden"> {/* Changed to h-screen */}
      <div className="relative flex h-[calc(100vh-64px)] pt-16"> {/* Moved pt-16 here */}
        {/* Desktop Sidebar */}
        <div className="hidden md:block fixed left-0 top-16 h-[calc(100vh-64px)] bg-background/10 backdrop-blur-sm border-r border-input/100 dark:border-[#1d1e30]">
          <SettingsSidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden fixed left-4 top-20 z-40"
              size="icon"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 pt-16">
            <SettingsSidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <main className="flex-1 md:pl-72 px-4 md:px-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-4xl mx-auto py-6 md:py-8 pb-16"> {/* Changed to pb-16 */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}