import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'


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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message?.includes('not confirmed')) {
        return { error: { message: 'Email ainda não confirmado. Verifique sua caixa de entrada.' } }
      }
      return { error: { message: error.message || 'Email ou senha incorretos' } }
    }
    if (data.session?.user) setUser(data.session.user)
    return { error: null }
  }

  const signUpWithEmail = async (email: string, password: string, nome: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } }
    })
    if (error) return { data: null, error: { message: error.message || 'Erro ao criar conta' } }
    if (data.session?.user) setUser(data.session.user)
    return { data, error: null }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    })
    if (error) return { error: { message: error.message || 'Erro ao enviar email' } }
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, signOut }
}
