-- ===== TABELAS =====

create table public.produtos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  categoria text not null default 'Geral',
  preco numeric(12,2) not null default 0,
  estoque integer not null default 0,
  vendidos integer not null default 0,
  status text not null default 'Ativo',
  created_at timestamptz default now()
);

create table public.clientes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  email text not null,
  pedidos integer not null default 0,
  gasto_total numeric(12,2) not null default 0,
  status text not null default 'Novo',
  created_at timestamptz default now()
);

create table public.pedidos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  codigo text not null,
  cliente_nome text not null,
  itens integer not null default 1,
  valor numeric(12,2) not null default 0,
  pagamento text not null default 'PIX',
  status text not null default 'Pendente',
  created_at timestamptz default now()
);

-- ===== ROW LEVEL SECURITY =====

alter table public.produtos enable row level security;
alter table public.clientes enable row level security;
alter table public.pedidos enable row level security;

-- Cada usuário só vê/edita seus próprios dados
create policy "Users manage own produtos" on public.produtos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own clientes" on public.clientes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own pedidos" on public.pedidos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
