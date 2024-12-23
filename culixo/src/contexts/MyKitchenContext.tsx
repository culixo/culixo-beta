// src/contexts/MyKitchenContext.tsx
"use client"

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Recipe, Collection, UserStats, RecentActivity } from '@/types/my-kitchen'

type SortOption = 'recent' | 'popular' | 'alphabetical' | 'cookingTime'

interface MyKitchenState {
  view: 'grid' | 'list'
  sortBy: SortOption
  recipes: Recipe[]
  savedRecipes: Recipe[]
  collections: Collection[]
  stats: UserStats
  recentActivity: RecentActivity[]
  loading: boolean
  error: string | null
}

type MyKitchenAction =
  | { type: 'SET_VIEW'; payload: 'grid' | 'list' }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'SET_RECIPES'; payload: Recipe[] }
  | { type: 'SET_SAVED_RECIPES'; payload: Recipe[] }
  | { type: 'SET_COLLECTIONS'; payload: Collection[] }
  | { type: 'SET_STATS'; payload: UserStats }
  | { type: 'SET_ACTIVITY'; payload: RecentActivity[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

const initialState: MyKitchenState = {
  view: 'grid',
  sortBy: 'recent',
  recipes: [],
  savedRecipes: [],
  collections: [],
  stats: {
    totalRecipes: 0,
    savedRecipes: 0,
    following: 0,
    followers: 0,
    streak: 0,
    favoriteCuisines: [],
    mostCookedRecipes: []
  },
  recentActivity: [],
  loading: false,
  error: null
}

const MyKitchenContext = createContext<{
  state: MyKitchenState
  dispatch: React.Dispatch<MyKitchenAction>
} | null>(null)

function myKitchenReducer(state: MyKitchenState, action: MyKitchenAction): MyKitchenState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload }
    case 'SET_RECIPES':
      return { ...state, recipes: action.payload }
    case 'SET_SAVED_RECIPES':
      return { ...state, savedRecipes: action.payload }
    case 'SET_COLLECTIONS':
      return { ...state, collections: action.payload }
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    case 'SET_ACTIVITY':
      return { ...state, recentActivity: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function MyKitchenProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(myKitchenReducer, initialState)

  return (
    <MyKitchenContext.Provider value={{ state, dispatch }}>
      {children}
    </MyKitchenContext.Provider>
  )
}

export function useMyKitchen() {
  const context = useContext(MyKitchenContext)
  if (!context) {
    throw new Error('useMyKitchen must be used within a MyKitchenProvider')
  }
  return context
}