import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInitials(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean)
  if (nameParts.length >= 2) {
    const first = nameParts[0]?.[0]
    const last = nameParts[nameParts.length - 1]?.[0]
    if (first && last) {
      return `${first}${last}`.toUpperCase()
    }
  }
  return fullName.slice(0, 2).toUpperCase() || '?'
}
