import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bovarrgrrxmpsqupklhj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdmFycmdycnhtcHNxdXBrbGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTEyNzIsImV4cCI6MjA5NDUyNzI3Mn0.PC59LkRoMqsdpDezGUM1k4XaxiAQm65jIz7aiKu7bks'

// Custom fetch that sanitizes headers to avoid ISO-8859-1 encoding errors
// This happens when user metadata contains non-ASCII chars (accents, etc.)
const safeFetch: typeof fetch = (input, init) => {
  if (init?.headers) {
    const headers = new Headers(init.headers as HeadersInit)
    const safeHeaders = new Headers()
    headers.forEach((value, key) => {
      // Encode non-ASCII values to avoid browser header encoding errors
      try {
        safeHeaders.set(key, value)
      } catch {
        // If header value contains non-ISO-8859-1, encode it
        safeHeaders.set(key, encodeURIComponent(value))
      }
    })
    return fetch(input, { ...init, headers: safeHeaders })
  }
  return fetch(input, init)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: safeFetch }
})
