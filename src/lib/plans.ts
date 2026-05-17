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

// For now everyone is on starter (until payment is integrated)
export function getUserPlan(): 'starter' | 'business' {
  // TODO: Check Stripe subscription status
  return 'starter'
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
