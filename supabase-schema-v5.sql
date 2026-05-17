-- ===== V5: PERFIS DE USUÁRIO + ADMIN =====

-- Tabela de perfis ligada ao auth.users
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nome text,
  plano text not null default 'starter' check (plano in ('starter','business')),
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

-- Função: verifica se usuário atual é admin
create or replace function public.is_current_user_admin() returns boolean
language sql security definer stable as $$
  select coalesce((select is_admin from public.user_profiles where id = auth.uid()), false)
$$;

-- Policies
drop policy if exists "read own profile or admin" on public.user_profiles;
create policy "read own profile or admin" on public.user_profiles for select
  using (auth.uid() = id or public.is_current_user_admin());

drop policy if exists "update own profile or admin" on public.user_profiles;
create policy "update own profile or admin" on public.user_profiles for update
  using (auth.uid() = id or public.is_current_user_admin())
  with check (auth.uid() = id or public.is_current_user_admin());

drop policy if exists "insert own profile" on public.user_profiles;
create policy "insert own profile" on public.user_profiles for insert
  with check (auth.uid() = id);

-- Trigger: cria profile automaticamente em todo novo signup
-- Email "dougla1508@gmail.com" vira admin automaticamente
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into public.user_profiles (id, email, nome, plano, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', new.email),
    'starter',
    lower(new.email) = 'dougla1508@gmail.com'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: cria profile pra usuários que já existem
insert into public.user_profiles (id, email, nome, plano, is_admin)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'nome', u.email),
  'starter',
  lower(u.email) = 'dougla1508@gmail.com'
from auth.users u
where u.id not in (select id from public.user_profiles);
