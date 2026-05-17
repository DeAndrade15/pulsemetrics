-- ===== NOVAS COLUNAS =====

-- Imagem do produto (URL)
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS imagem_url text;

-- Descrição do produto
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS descricao text;

-- ===== TABELA: CATEGORIAS PERSONALIZÁVEIS =====
CREATE TABLE IF NOT EXISTS public.categorias (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  created_at timestamptz default now()
);

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own categorias" ON public.categorias
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ===== TABELA: MEMBROS DA EQUIPE (MULTI-USUÁRIO) =====
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  member_email text not null,
  member_name text not null default '',
  role text not null default 'viewer', -- 'admin', 'editor', 'viewer'
  invited_at timestamptz default now(),
  accepted boolean default false
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage team" ON public.team_members
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- ===== TABELA: CONFIGURAÇÕES DA LOJA =====
CREATE TABLE IF NOT EXISTS public.store_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  store_name text not null default 'Minha Loja',
  store_slug text unique,
  description text,
  logo_url text,
  whatsapp text,
  instagram text,
  show_prices boolean default true,
  catalog_active boolean default true,
  low_stock_threshold integer default 5,
  created_at timestamptz default now()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own store" ON public.store_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy para catálogo público (leitura sem autenticação)
CREATE POLICY "Public can read active catalogs" ON public.store_settings
  FOR SELECT USING (catalog_active = true);

-- Produtos podem ser lidos publicamente se o catálogo estiver ativo
CREATE POLICY "Public can read products for active catalogs" ON public.produtos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.store_settings
      WHERE store_settings.user_id = produtos.user_id
      AND store_settings.catalog_active = true
    )
  );

-- ===== TABELA: NOTIFICAÇÕES =====
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null, -- 'low_stock', 'new_order', 'team_invite'
  title text not null,
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
