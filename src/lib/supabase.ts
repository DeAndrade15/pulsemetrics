import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bovarrgrrxmpsqupklhj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdmFycmdycnhtcHNxdXBrbGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTEyNzIsImV4cCI6MjA5NDUyNzI3Mn0.PC59LkRoMqsdpDezGUM1k4XaxiAQm65jIz7aiKu7bks'

// Custom fetch that sanitizes headers to avoid ISO-8859-1 encoding errors
// Manually strips non-Latin1 chars BEFORE Headers constructor sees them
const sanitizeValue = (v: unknown): string => {
  const s = String(v ?? '')
  // Replace any code point > 0xFF with '?' (ISO-8859-1 only allows 0x00-0xFF)
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i)
    out += code > 0xFF ? '?' : s[i]
  }
  return out
}

const safeFetch: typeof fetch = (input, init) => {
  if (!init?.headers) return fetch(input, init)

  const sanitized: Record<string, string> = {}
  const raw = init.headers

  if (raw instanceof Headers) {
    raw.forEach((v, k) => { sanitized[k] = sanitizeValue(v) })
  } else if (Array.isArray(raw)) {
    for (const pair of raw) {
      if (pair && pair.length >= 2) sanitized[pair[0]] = sanitizeValue(pair[1])
    }
  } else {
    const obj = raw as Record<string, string>
    for (const k in obj) sanitized[k] = sanitizeValue(obj[k])
  }

  return fetch(input, { ...init, headers: sanitized })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: safeFetch }
})
