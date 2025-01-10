// src/components/auth/AuthSuccessHandler.tsx
"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { recipeService } from '@/services/recipeService'
import { useAuth } from '@/hooks/useAuth'

export function AuthSuccessHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setPendingInteraction } = useAuth()

  useEffect(() => {
    const processPendingAction = async () => {
      const action = searchParams.get('action')
      const recipeId = searchParams.get('recipeId')
      const returnTo = searchParams.get('returnTo')

      if (action && recipeId) {
        try {
          if (action === 'like') {
            await recipeService.likeRecipe(recipeId)
          } else if (action === 'save') {
            await recipeService.saveRecipe(recipeId)
          }

          // After successful action, redirect back
          setPendingInteraction(null)
          if (returnTo) {
            router.push(returnTo)
          }
        } catch (error) {
          console.error('Error executing pending interaction:', error)
        }
      }
    }

    if (searchParams.get('action') && searchParams.get('recipeId')) {
      processPendingAction()
    }
  }, [searchParams, router, setPendingInteraction])

  return null
}