-- ===== V3: REESTRUTURAÇÃO PARA VENDEDORES =====

-- Clientes: adicionar telefone
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS telefone text;

-- Pedidos: adicionar controle de pagamento
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS cliente_id uuid references public.clientes(id) on delete set null;
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS valor_pago numeric(12,2) not null default 0;
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS data_vencimento date;
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS observacao text;
