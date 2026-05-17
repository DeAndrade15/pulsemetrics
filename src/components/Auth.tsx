import { useState } from 'react'
import { Activity } from 'lucide-react'
import styles from './Auth.module.css'

interface AuthProps {
  onSignIn: (email: string, password: string) => Promise<{ error: unknown }>
  onSignUp: (email: string, password: string, nome: string) => Promise<{ error: unknown }>
  onGoogle: () => Promise<{ error: unknown }>
  onDemo: () => void
}

export function Auth({ onSignIn, onSignUp, onGoogle, onDemo }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = isLogin
      ? await onSignIn(email, password)
      : await onSignUp(email, password, nome)

    if (error) {
      setError(typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'Erro ao autenticar')
    }
    setLoading(false)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}><Activity size={22} /></div>
          <span className={styles.brandName}>PulseMetrics</span>
        </div>

        <h2 className={styles.title}>{isLogin ? 'Bem-vindo de volta' : 'Criar conta'}</h2>
        <p className={styles.subtitle}>
          {isLogin ? 'Acesse seu dashboard de analytics' : 'Comece a monitorar suas vendas'}
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.field}>
              <label>Nome</label>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar conta'}
          </button>

          <div className={styles.divider}><span>ou</span></div>

          <button type="button" className={styles.btnGoogle} onClick={onGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar com Google
          </button>

          <button type="button" className={styles.btnDemo} onClick={onDemo}>
            Explorar modo demo
          </button>
        </form>

        <div className={styles.toggle}>
          {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
          <button onClick={() => { setIsLogin(!isLogin); setError('') }}>
            {isLogin ? 'Criar agora' : 'Fazer login'}
          </button>
        </div>
      </div>
    </div>
  )
}
