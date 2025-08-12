import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>
  reset: () => void
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<{ data?: T; error?: string; status: number }>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const result = await apiFunction(...args)
        
        if (result.error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: result.error || 'An error occurred',
          }))
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            data: result.data || null,
          }))
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        }))
      }
    },
    [apiFunction]
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Specific hooks for different API endpoints
export function useBlogs() {
  return useApi(apiClient.getBlogs)
}

export function useEvents() {
  return useApi(apiClient.getEvents)
}

export function useMembers() {
  return useApi(apiClient.getMembers)
}

export function useDonations() {
  return useApi(apiClient.getDonations)
}

export function useGallery() {
  return useApi(apiClient.getGallery)
}

export function useLibrary() {
  return useApi(apiClient.getLibrary)
}

export function useProjects() {
  return useApi(apiClient.getProjects)
}

export function usePages() {
  return useApi(apiClient.getPages)
}

export function useFaqs() {
  return useApi(apiClient.getFaqs)
}
