-- ===== V6: REMOVE EMAIL ADMIN HARDCODED =====
-- O email do admin agora fica numa função privada do banco (security definer)
-- que NÃO vai pro código público.

-- 1. Função que retorna o admin email — VOCÊ cria essa manualmente no SQL Editor
--    com o email real. Exemplo (NÃO commitar com email real):
--
--    create or replace function public.get_admin_email() returns text
--    language sql security definer stable as $$
--      select 'SEU_EMAIL_AQUI'::text
--    $$;
--    revoke execute on function public.get_admin_email() from anon, authenticated;

-- 2. Trigger atualizado que usa a função em vez de hardcode
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
