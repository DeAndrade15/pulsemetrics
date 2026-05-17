import { useState } from 'react'
import { Activity, Mail, ArrowLeft } from 'lucide-react'
import styles from './Auth.module.css'

interface AuthProps {
  onSignIn: (email: string, password: string) => Promise<{ error: unknown }>
  onSignUp: (email: string, password: string, nome: string) => Promise<{ data: unknown; error: unknown }>
  onGoogle: () => Promise<{ error: unknown }>
  onResetPassword: (email: string) => Promise<{ error: unknown }>
  onDemo: () => void
}

// Verifica se a senha está em vazamentos conhecidos via HaveIBeenPwned API
// Usa k-anonymity: só envia os 5 primeiros caracteres do hash SHA-1 (a senha nunca trafega)
async function checkPasswordLeaked(password: string): Promise<{ leaked: boolean; count: number }> {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()

    const prefix = hashHex.slice(0, 5)
    const suffix = hashHex.slice(5)

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' } // anti-fingerprinting
    })
    if (!res.ok) return { leaked: false, count: 0 } // fail open se API offline

    const text = await res.text()
    for (const line of text.split('\n')) {
      const [hashSuffix, countStr] = line.split(':')
      if (hashSuffix.trim().toUpperCase() === suffix) {
        return { leaked: true, count: parseInt(countStr, 10) || 1 }
      }
    }
    return { leaked: false, count: 0 }
  } catch {
    return { leaked: false, count: 0 } // se algo quebrar, não bloqueia
  }
}

// Avalia força da senha: retorna 0 (muito fraca) a 4 (forte)
function passwordStrength(pw: string): { score: number; label: string; color: string; problems: string[] } {
  const problems: string[] = []
  if (pw.length < 8) problems.push('Mínimo 8 caracteres')
  if (!/[A-Za-z]/.test(pw)) problems.push('Pelo menos 1 letra')
  if (!/[0-9]/.test(pw)) problems.push('Pelo menos 1 número')

  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  score = Math.min(score, 4)

  // Senhas comuns/óbvias
  const common = ['12345678', 'senha123', 'password', 'qwerty123', 'admin123', '11111111', 'flamengo']
  if (common.some(c => pw.toLowerCase().includes(c))) {
    score = Math.min(score, 1)
    problems.push('Evite palavras óbvias ou comuns')
  }

  const labels = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte']
  const colors = ['#ef4444', '#f59e0b', '#facc15', '#84cc16', '#10b981']
  return { score, label: labels[score], color: colors[score], problems }
}

export function Auth({ onSignIn, onSignUp, onGoogle, onResetPassword, onDemo }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgot, setIsForgot] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const strength = !isLogin && password ? passwordStrength(password) : null
  const canSubmitSignup = !isLogin && strength && strength.problems.length === 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isLogin) {
      const { error } = await onSignIn(email, password)
      if (error) {
        setError(typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'Email ou senha incorretos')
      }
    } else {
      // Validação extra antes de enviar
      const s = passwordStrength(password)
      if (s.problems.length > 0) {
        setError(`Senha não atende aos requisitos: ${s.problems.join(', ')}`)
        setLoading(false)
        return
      }
      // Checa se a senha já apareceu em vazamentos conhecidos
      const leak = await checkPasswordLeaked(password)
      if (leak.leaked) {
        setError(`Esta senha já apareceu em ${leak.count.toLocaleString('pt-BR')} vazamentos públicos. Escolha outra senha pra sua segurança.`)
        setLoading(false)
        return
      }
      const { error } = await onSignUp(email, password, nome)
      if (error) {
        setError(typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'Erro ao criar conta')
      } else {
        setEmailSent(true)
      }
    }
    setLoading(false)
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await onResetPassword(email)
    if (error) {
      setError(typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'Erro ao enviar email de recuperação')
    } else {
      setResetSent(true)
    }
    setLoading(false)
  }

  // Password reset sent screen
  if (resetSent) {
    return (
      <div className={styles.overlay}>
        <div className={styles.card}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}><Activity size={22} /></div>
            <span className={styles.brandName}>PulseMetrics</span>
          </div>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Mail size={28} color="#10b981" />
            </div>
            <h2 className={styles.title}>Email enviado!</h2>
            <p className={styles.subtitle} style={{ marginBottom: 16 }}>
              Enviamos um link de recuperação para
            </p>
            <p style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1rem', color: 'var(--white)', marginBottom: 24, padding: '10px 16px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', display: 'inline-block' }}>
              {email}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 28 }}>
              Clique no link para redefinir sua senha.<br />
              Verifique também a pasta de spam.
            </p>
            <button className={styles.btnSubmit} onClick={() => { setResetSent(false); setIsForgot(false); setError('') }} style={{ maxWidth: 280, margin: '0 auto' }}>
              <ArrowLeft size={16} style={{ marginRight: 6 }} />
              Voltar para o login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Forgot password form
  if (isForgot) {
    return (
      <div className={styles.overlay}>
        <div className={styles.card}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}><Activity size={22} /></div>
            <span className={styles.brandName}>PulseMetrics</span>
          </div>
          <h2 className={styles.title}>Recuperar senha</h2>
          <p className={styles.subtitle}>Digite seu email para receber o link de recuperação</p>
          {error && <div className={styles.error}>{error}</div>}
          <form className={styles.form} onSubmit={handleForgot}>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </form>
          <div className={styles.toggle}>
            <button onClick={() => { setIsForgot(false); setError('') }}>
              Voltar para o login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Email confirmation screen
  if (emailSent) {
    return (
      <div className={styles.overlay}>
        <div className={styles.card}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}><Activity size={22} /></div>
            <span className={styles.brandName}>PulseMetrics</span>
          </div>

          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Mail size={28} color="#10b981" />
            </div>

            <h2 className={styles.title}>Verifique seu email</h2>
            <p className={styles.subtitle} style={{ marginBottom: 16 }}>
              Enviamos um link de confirmação para
            </p>
            <p style={{
              fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1rem',
              color: 'var(--white)', marginBottom: 24,
              padding: '10px 16px', background: 'var(--bg3)',
              borderRadius: 10, border: '1px solid var(--border)',
              display: 'inline-block'
            }}>
              {email}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 28 }}>
              Clique no link enviado para ativar sua conta.<br />
              Verifique também a pasta de spam.
            </p>

            <button
              className={styles.btnSubmit}
              onClick={() => { setEmailSent(false); setIsLogin(true); setError('') }}
              style={{ maxWidth: 280, margin: '0 auto' }}
            >
              <ArrowLeft size={16} style={{ marginRight: 6 }} />
              Voltar para o login
            </button>

            <button
              type="button"
              className={styles.btnDemo}
              onClick={onDemo}
              style={{ maxWidth: 280, margin: '12px auto 0' }}
            >
              Explorar modo demo
            </button>
          </div>
        </div>
      </div>
    )
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
              placeholder={isLogin ? 'Sua senha' : 'Mínimo 8 caracteres, com letra e número'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isLogin ? 6 : 8}
            />
            {!isLogin && password && strength && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < strength.score ? strength.color : 'rgba(255,255,255,0.08)', transition: 'background 0.2s' }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600, fontFamily: 'DM Sans' }}>
                  {strength.label}
                </div>
                {strength.problems.length > 0 && (
                  <ul style={{ margin: '6px 0 0', padding: '0 0 0 16px', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                    {strength.problems.map(p => <li key={p}>{p}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>

          {isLogin && (
            <button type="button" onClick={() => { setIsForgot(true); setError('') }} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'DM Sans', padding: 0, marginTop: -8 }}>
              Esqueci minha senha
            </button>
          )}

          <button type="submit" className={styles.btnSubmit} disabled={loading || (!isLogin && !canSubmitSignup)}>
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
