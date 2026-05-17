import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUpWithEmail = async (email: string, password: string, _nome: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://bovarrgrrxmpsqupklhj.supabase.co'}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdmFycmdycnhtcHNxdXBrbGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTEyNzIsImV4cCI6MjA5NDUyNzI3Mn0.PC59LkRoMqsdpDezGUM1k4XaxiAQm65jIz7aiKu7bks',
        },
        body: JSON.stringify({
          email,
          password,
          data: { nome: _nome },
        }),
      })
      const json = await res.json()
      if (!res.ok) return { data: null, error: { message: json.msg || json.error_description || 'Erro ao criar conta' } }
      // Refresh session
      await supabase.auth.signInWithPassword({ email, password })
      return { data: json, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, session, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut }
}
