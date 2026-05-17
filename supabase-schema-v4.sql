-- ===== V4: VENDAS LIGADAS A PRODUTOS =====

-- Pedidos: ligar a produto
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS produto_id uuid references public.produtos(id) on delete set null;
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS produto_nome text;
