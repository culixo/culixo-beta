// src/components/auth/AuthModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export function AuthModal() {
  const router = useRouter()
  const { showAuthModal, setShowAuthModal, pendingInteraction } = useAuth()

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams()
    if (pendingInteraction) {
      searchParams.set('returnTo', currentPath)
      searchParams.set('action', pendingInteraction.type)
      searchParams.set('recipeId', pendingInteraction.recipeId)
    }
    setShowAuthModal(false)
    router.replace(`/login?${searchParams.toString()}`, { scroll: false })
  }

  const handleSignup = () => {
    const searchParams = new URLSearchParams()
    if (pendingInteraction) {
      searchParams.set('returnTo', pendingInteraction.returnTo)
      searchParams.set('action', pendingInteraction.type)
      searchParams.set('recipeId', pendingInteraction.recipeId)
    }
    setShowAuthModal(false)
    router.replace(`/signup?${searchParams.toString()}`)
  }

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Culixo to interact with recipes</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 mt-4">
          <Button onClick={handleLogin} variant="default">
            Log In
          </Button>
          <Button onClick={handleSignup} variant="outline">
            Sign Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}