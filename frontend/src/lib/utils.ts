import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BASE_URL } from "./api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFullImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl) return undefined
  if (imageUrl.startsWith('http')) return imageUrl
  return `${BASE_URL}${imageUrl}`
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
