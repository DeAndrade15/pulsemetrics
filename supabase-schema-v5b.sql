-- ===== V5b: AJUSTES NO ADMIN E NOME =====

-- Admin sempre tem plano Business
update public.user_profiles set plano = 'business' where is_admin = true;

-- Atualiza o trigger pra:
-- 1. Detectar nome também de full_name e name (Google OAuth)
-- 2. Admin já entra como Business
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer as $$
declare
  is_admin_flag boolean := lower(new.email) = 'REDACTED_ADMIN_EMAIL';
begin
  insert into public.user_profiles (id, email, nome, plano, is_admin)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'nome',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.email
    ),
    case when is_admin_flag then 'business' else 'starter' end,
    is_admin_flag
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Atualiza profiles existentes que tem o email como nome (cadastro Google sem nome)
-- a partir do raw_user_meta_data
update public.user_profiles up
set nome = coalesce(
  u.raw_user_meta_data->>'nome',
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'name',
  u.email
)
from auth.users u
where up.id = u.id
  and (up.nome is null or up.nome = up.email);
