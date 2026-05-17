-- ===== V6: REMOVE EMAIL ADMIN HARDCODED =====
-- Move o email do admin pra uma config secreta do Postgres
-- que não fica exposta no código público.

-- 1. Cria função pra buscar o admin email do GUC (Grand Unified Configuration)
create or replace function public.get_admin_email() returns text
language sql stable as $$
  select current_setting('app.admin_email', true)
$$;

-- 2. Atualiza o trigger pra usar a função em vez de hardcode
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer as $$
declare
  admin_email text := public.get_admin_email();
  is_admin_flag boolean := admin_email is not null and lower(new.email) = lower(admin_email);
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

-- 3. IMPORTANTE: Você precisa rodar manualmente, UMA VEZ, no SQL Editor do Supabase:
--    (substitua SEU_EMAIL_AQUI pelo seu email real)
--
-- alter database postgres set app.admin_email = 'SEU_EMAIL_AQUI';
--
-- Isso salva o email como configuração do banco, NÃO vai pro código.
