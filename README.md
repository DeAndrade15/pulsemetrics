# PulseMetrics

> SaaS multi-tenant de gestão financeira e operacional para vendedores autônomos.

[**🌐 Acessar plataforma →**](https://pulsemetrics-sable.vercel.app)

![Stack](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TS](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ecf8e?logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-RLS-336791?logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)

---

## 🎯 Problema

Vendedores autônomos (perfumistas, revendedores, lojistas pequenos) controlam vendas em caderno, planilha bagunçada ou WhatsApp. Não sabem:

- Quanto receberam de fato vs quanto têm a receber
- Quem está devendo e há quanto tempo
- Quais produtos vendem mais (e quais ficam encalhados)
- Como acompanhar estoque sem contar item por item

O resultado: dinheiro perdido por cobrança esquecida, estoque desatualizado e zero visibilidade do negócio.

## 💡 Solução

PulseMetrics oferece um painel completo no navegador (também instalável como PWA no celular) que centraliza:

- **Dashboard financeiro** com Recebido / A Receber / Vendas Total e lista de devedores em destaque
- **Vendas linkadas a produtos** — selecionar produto no dropdown baixa estoque automaticamente
- **Vendas linkadas a clientes** — atualiza pedidos e gasto total do cliente em cascata
- **Status de pagamento** flexível: Pago, Pendente, Parcial, Atrasado, Cancelado
- **Cobrança via WhatsApp** com 4 templates editáveis (Amigável, Direto, Casual, Formal) e modo livre
- **Catálogo público** com link compartilhável (`/catalogo/:slug`) para clientes navegarem
- **Painel admin** para gerenciar contas e promover usuários entre planos

---

## ✨ Principais funcionalidades

### Autenticação e segurança
- Login com email/senha ou Google OAuth (PKCE flow)
- Validação de senha: mínimo 8 chars com letra e número
- **Bloqueio de senhas vazadas** via HaveIBeenPwned (k-anonymity — só envia 5 chars do hash SHA-1, equivalente ao Pro do Supabase, mas gratuito)
- Indicador visual de força da senha em tempo real
- CAPTCHA no signup contra bots
- **Row Level Security** no Postgres garantindo isolamento total entre tenants

### Gestão operacional
- CRUD de produtos com foto, categoria, preço, estoque e status (Ativo / Baixo / Esgotado)
- CRUD de clientes com WhatsApp clicável (abre wa.me direto), email opcional e status (VIP / Ativo / Novo)
- CRUD de vendas com cliente + produto + valor calculado automaticamente, valor pago, vencimento, observação
- **Atualização em cascata**: criar/deletar venda reverte estoque e contadores do cliente
- Export CSV de produtos, clientes e vendas

### Dashboard analítico
- KPIs: Receita Total, Pedidos, Clientes, Ticket Médio
- Cards destacando Recebido / A Receber / Vendas com gradient diferenciado
- Tabela de devedores ordenada por valor com botão "Cobrar via WhatsApp" inline
- Gráfico de **Vendas por Categoria** calculado dinamicamente a partir dos produtos vendidos
- Seção "Produtos com Menos Saída" para identificar estoque parado

### Catálogo público
- Cada loja tem slug personalizado (`/catalogo/minha-loja`)
- Vitrine de produtos com fotos, preços (opcional), busca e filtros
- Botão direto para WhatsApp da loja
- SEO meta tags dinâmicas

### Admin
- Página exclusiva (visível apenas para admin definido por função privada no banco)
- Lista todas as contas registradas
- Estatísticas: total de contas, Business vs Starter, novos nos últimos 7 dias
- Promover/rebaixar usuários entre planos com 1 clique

### PWA
- Manifest.json + Service Worker
- Instalável no celular como app nativo
- Funciona offline (cache de assets estáticos)

---

## 🛠️ Stack técnica

**Frontend**
- React 18 + TypeScript
- Vite (dev server e build)
- Recharts (gráficos)
- Lucide (ícones)
- CSS Modules + glassmorphism custom

**Backend / dados**
- Supabase (Postgres + Auth + Storage)
- Row Level Security policies para multi-tenant
- Functions e triggers para enforcement no banco
- Trigger automático que cria `user_profiles` no signup

**Deploy / infra**
- Vercel (frontend + edge)
- Supabase managed (banco + auth)

**Segurança**
- HaveIBeenPwned API (k-anonymity password check)
- hCaptcha (anti-bot no signup)
- HTTPS forçado em tudo
- OAuth secrets rotacionáveis

---

## 🧠 Desafios técnicos resolvidos

### 1. Multi-tenant sem servidor próprio
Em vez de implementar um backend Node com autenticação custom, usei **Row Level Security do Postgres** para garantir que cada query do cliente só retorne dados pertencentes ao próprio `user_id`. Policies escritas em SQL:
```sql
create policy "users see own products" on produtos
  for select using (auth.uid() = user_id);
```
Isso elimina uma classe inteira de bugs de autorização — mesmo que o frontend envie uma query maliciosa, o banco bloqueia.

### 2. Detecção de senhas vazadas no cliente (sem custo)
O Supabase oferece checagem contra HaveIBeenPwned apenas no plano Pro. Implementei a mesma proteção no client-side usando k-anonymity:
- Hash SHA-1 da senha no browser (não trafega)
- Envia apenas os primeiros 5 chars do hash pra API
- API retorna lista de hashes que começam com aqueles 5 chars
- Compara localmente o sufixo

Resultado: bloqueio efetivo de senhas que aparecem em vazamentos conhecidos (12+ bilhões de credenciais), sem custo e sem comprometer privacidade.

### 3. Atualização em cascata de estoque e clientes
Cada venda referencia um produto e um cliente. Ao criar uma venda:
1. Insere registro em `pedidos`
2. Decrementa `estoque` do produto e incrementa `vendidos`
3. Atualiza status do produto (`Esgotado` se chegou a 0)
4. Incrementa `pedidos` e `gasto_total` do cliente

Ao deletar, todas as operações são revertidas. Implementado sequencialmente no client com fetch da row atual antes do update para evitar race conditions, com fallback caso algum passo falhe.

### 4. Identificação de admin sem hardcode no código
O email do admin é determinado por uma `SECURITY DEFINER function` privada no Postgres:
```sql
create or replace function public.get_admin_email() returns text
language sql security definer stable as $$
  select 'admin@example.com'::text
$$;
revoke execute on function public.get_admin_email() from anon, authenticated;
```
Isso garante que o email **nunca apareça no código público** (commitado no GitHub), nem em variáveis de ambiente expostas ao cliente. Só o banco sabe.

---

## 📦 Estrutura do projeto

```
pulsemetrics/
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service worker
│   └── favicon.svg          # Logo P geométrico
├── src/
│   ├── components/
│   │   ├── Auth.tsx         # Login/signup com password strength
│   │   ├── LandingPage.tsx
│   │   ├── PublicCatalog.tsx
│   │   └── LegalPages.tsx
│   ├── lib/
│   │   ├── supabase.ts      # Cliente com fetch sanitizado
│   │   ├── useAuth.ts       # Hook de autenticação
│   │   ├── useData.ts       # Hooks de CRUD + admin
│   │   ├── plans.ts         # Limites por plano
│   │   └── types.ts
│   ├── App.tsx              # Painel principal com todas as páginas
│   └── App.module.css
├── supabase-schema-v*.sql   # Migrations versionadas
└── vercel.json
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node 18+
- Conta Supabase (gratuita)

### Setup
```bash
git clone https://github.com/DeAndrade15/pulsemetrics.git
cd pulsemetrics
npm install
```

### Configurar Supabase
1. Crie um projeto novo em [supabase.com](https://supabase.com)
2. No SQL Editor, rode os arquivos `supabase-schema-v*.sql` na ordem
3. Em **Authentication → Providers**, ative Email e Google (opcional)
4. Copie `URL` e `anon key` do projeto

### Variáveis de ambiente
```bash
# .env (opcional — há fallback hardcoded)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

### Rodar
```bash
npm run dev      # http://localhost:5173
npm run build    # produção
npm run preview  # testa o build
```

---

## 📋 Roadmap

- [ ] Integração com Stripe para cobrança real do plano Business
- [ ] 2FA opcional
- [ ] Notificações por email (low stock, vencimento de fiado)
- [ ] App nativo via Capacitor/Tauri
- [ ] Modo offline com sync

---

## 🤝 Contato

Desenvolvido por **Douglas Andrade**.

[Portfólio](https://portfolio-douglas-alpha.vercel.app) · [LinkedIn](https://linkedin.com/in/douglas-andrade) · [GitHub](https://github.com/DeAndrade15)

---

## 📄 Licença

MIT — uso livre desde que mantenha os créditos.
