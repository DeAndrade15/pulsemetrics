import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bovarrgrrxmpsqupklhj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdmFycmdycnhtcHNxdXBrbGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTEyNzIsImV4cCI6MjA5NDUyNzI3Mn0.PC59LkRoMqsdpDezGUM1k4XaxiAQm65jIz7aiKu7bks'

const authHeaders = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle email confirmation redirect
    // Supabase PKCE flow: ?code=... in query params
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    const tokenHash = url.searchParams.get('token_hash')
    const type = url.searchParams.get('type')

    // Also check hash-based tokens (legacy flow)
    const hash = window.location.hash

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data }) => {
        setUser(data.session?.user ?? null)
        setLoading(false)
        window.history.replaceState(null, '', window.location.pathname)
      })
      return
    }

    if (tokenHash && type) {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any }).then(({ data }) => {
        setUser(data.session?.user ?? null)
        setLoading(false)
        window.history.replaceState(null, '', window.location.pathname)
      })
      return
    }

    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ data }) => {
          setUser(data.session?.user ?? null)
          setLoading(false)
          window.history.replaceState(null, '', window.location.pathname)
        })
        return
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) return { error: { message: json.error_description || json.msg || 'Email ou senha incorretos' } }

      // Set session in supabase client
      const { data } = await supabase.auth.setSession({
        access_token: json.access_token,
        refresh_token: json.refresh_token,
      })
      if (data.session?.user) setUser(data.session.user)
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const signUpWithEmail = async (email: string, password: string, nome: string) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ email, password, data: { nome } }),
      })
      const json = await res.json()
      if (!res.ok) return { data: null, error: { message: json.error_description || json.msg || 'Erro ao criar conta' } }

      // If email confirmation is disabled, auto-login
      if (json.access_token) {
        await supabase.auth.setSession({
          access_token: json.access_token,
          refresh_token: json.refresh_token,
        })
      }
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

  const resetPassword = async (email: string) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const json = await res.json()
        return { error: { message: json.error_description || json.msg || 'Erro ao enviar email' } }
      }
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, signOut }
}
