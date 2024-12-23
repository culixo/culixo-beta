// src/app/my-kitchen/page.tsx
import { Suspense } from 'react'
import MyKitchenLayout from '@/components/my-kitchen/MyKitchenLayout'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { MyKitchenProvider } from '@/contexts/MyKitchenContext'

export default function MyKitchenPage() {
  return (
    <MyKitchenProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <MyKitchenLayout />
      </Suspense>
    </MyKitchenProvider>
  )
}