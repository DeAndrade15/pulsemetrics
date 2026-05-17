export interface PlanLimits {
  produtos: number
  pedidosMes: number
  clientes: number
  team: number
}

export const PLANS: Record<string, PlanLimits> = {
  starter: {
    produtos: 50,
    pedidosMes: 100,
    clientes: 200,
    team: 1,
  },
  business: {
    produtos: Infinity,
    pedidosMes: Infinity,
    clientes: Infinity,
    team: 5,
  },
}

// Read plan from user_profiles table (managed by admin or Stripe integration in the future)
export function getUserPlan(profile?: { plano?: 'starter' | 'business' } | null): 'starter' | 'business' {
  return profile?.plano === 'business' ? 'business' : 'starter'
}

export function checkLimit(plan: 'starter' | 'business', resource: keyof PlanLimits, currentCount: number): { allowed: boolean; limit: number; current: number } {
  const limits = PLANS[plan]
  const limit = limits[resource]
  return {
    allowed: currentCount < limit,
    limit,
    current: currentCount,
  }
}

export function getLimitMessage(resource: string, limit: number): string {
  return `Você atingiu o limite de ${limit} ${resource} no plano Starter. Faça upgrade para o plano Business para ter acesso ilimitado.`
}
