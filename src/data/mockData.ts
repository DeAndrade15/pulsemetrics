export const kpis = [
  { label: 'Receita Total', value: 'R$ 284.520', change: '+12.5%', up: true, icon: 'dollar-sign' },
  { label: 'Pedidos', value: '1.842', change: '+8.2%', up: true, icon: 'shopping-cart' },
  { label: 'Clientes Ativos', value: '3.621', change: '+5.1%', up: true, icon: 'users' },
  { label: 'Ticket Médio', value: 'R$ 154,50', change: '-2.3%', up: false, icon: 'trending-up' },
];

export const revenueData = [
  { mes: 'Jan', receita: 18500, pedidos: 120 },
  { mes: 'Fev', receita: 22300, pedidos: 145 },
  { mes: 'Mar', receita: 19800, pedidos: 132 },
  { mes: 'Abr', receita: 27600, pedidos: 178 },
  { mes: 'Mai', receita: 31200, pedidos: 195 },
  { mes: 'Jun', receita: 28900, pedidos: 182 },
  { mes: 'Jul', receita: 35400, pedidos: 220 },
  { mes: 'Ago', receita: 33100, pedidos: 208 },
  { mes: 'Set', receita: 38700, pedidos: 245 },
  { mes: 'Out', receita: 42100, pedidos: 268 },
  { mes: 'Nov', receita: 45800, pedidos: 290 },
  { mes: 'Dez', receita: 52300, pedidos: 325 },
];

export const categoryData = [
  { name: 'Eletrônicos', value: 35, color: '#10b981' },
  { name: 'Roupas', value: 25, color: '#22d3ee' },
  { name: 'Casa & Jardim', value: 20, color: '#f5c542' },
  { name: 'Esportes', value: 12, color: '#f43f5e' },
  { name: 'Outros', value: 8, color: '#6b7084' },
];

export const transactions = [
  { id: '#TXN-4821', cliente: 'Maria Silva', produto: 'MacBook Pro M3', valor: 'R$ 12.499', status: 'Concluído', data: '16 Mai 2026' },
  { id: '#TXN-4820', cliente: 'João Santos', produto: 'iPhone 16 Pro', valor: 'R$ 8.999', status: 'Concluído', data: '16 Mai 2026' },
  { id: '#TXN-4819', cliente: 'Ana Costa', produto: 'Samsung Galaxy S25', valor: 'R$ 5.499', status: 'Pendente', data: '15 Mai 2026' },
  { id: '#TXN-4818', cliente: 'Carlos Oliveira', produto: 'iPad Air', valor: 'R$ 6.299', status: 'Concluído', data: '15 Mai 2026' },
  { id: '#TXN-4817', cliente: 'Beatriz Lima', produto: 'AirPods Max', valor: 'R$ 4.599', status: 'Enviado', data: '14 Mai 2026' },
  { id: '#TXN-4816', cliente: 'Rafael Souza', produto: 'Dell XPS 15', valor: 'R$ 11.200', status: 'Concluído', data: '14 Mai 2026' },
  { id: '#TXN-4815', cliente: 'Fernanda Reis', produto: 'Apple Watch Ultra', valor: 'R$ 5.999', status: 'Pendente', data: '13 Mai 2026' },
];

export const topProducts = [
  { name: 'MacBook Pro M3', vendas: 342, receita: 'R$ 4.2M' },
  { name: 'iPhone 16 Pro', vendas: 521, receita: 'R$ 4.6M' },
  { name: 'Samsung Galaxy S25', vendas: 289, receita: 'R$ 1.5M' },
  { name: 'iPad Air', vendas: 198, receita: 'R$ 1.2M' },
  { name: 'AirPods Max', vendas: 445, receita: 'R$ 2.0M' },
];

// Analytics page
export const analyticsKpis = [
  { label: 'Taxa de Conversão', value: '3.42%', change: '+0.8%', up: true, icon: 'trending-up' },
  { label: 'Sessões', value: '48.291', change: '+15.3%', up: true, icon: 'users' },
  { label: 'Bounce Rate', value: '32.1%', change: '-4.2%', up: true, icon: 'trending-up' },
  { label: 'Tempo Médio', value: '4m 32s', change: '+12.1%', up: true, icon: 'dollar-sign' },
];

export const trafficData = [
  { source: 'Google Orgânico', visitas: 18420, conversao: '4.2%', receita: 'R$ 89.300' },
  { source: 'Instagram Ads', visitas: 12350, conversao: '2.8%', receita: 'R$ 52.100' },
  { source: 'Google Ads', visitas: 8900, conversao: '3.5%', receita: 'R$ 41.200' },
  { source: 'Direto', visitas: 6210, conversao: '5.1%', receita: 'R$ 38.900' },
  { source: 'Facebook Ads', visitas: 4820, conversao: '1.9%', receita: 'R$ 18.400' },
  { source: 'Email Marketing', visitas: 3100, conversao: '6.8%', receita: 'R$ 29.600' },
];

export const weeklyData = [
  { dia: 'Seg', visitas: 4200, conversoes: 142 },
  { dia: 'Ter', visitas: 5100, conversoes: 178 },
  { dia: 'Qua', visitas: 4800, conversoes: 165 },
  { dia: 'Qui', visitas: 5600, conversoes: 195 },
  { dia: 'Sex', visitas: 6200, conversoes: 220 },
  { dia: 'Sáb', visitas: 7800, conversoes: 285 },
  { dia: 'Dom', visitas: 5400, conversoes: 190 },
];

// Orders page
export const allOrders = [
  { id: '#ORD-5021', cliente: 'Maria Silva', itens: 3, valor: 'R$ 12.499', status: 'Entregue', data: '16 Mai 2026', pagamento: 'Cartão' },
  { id: '#ORD-5020', cliente: 'João Santos', itens: 1, valor: 'R$ 8.999', status: 'Entregue', data: '16 Mai 2026', pagamento: 'PIX' },
  { id: '#ORD-5019', cliente: 'Ana Costa', itens: 2, valor: 'R$ 5.499', status: 'Pendente', data: '15 Mai 2026', pagamento: 'Boleto' },
  { id: '#ORD-5018', cliente: 'Carlos Oliveira', itens: 1, valor: 'R$ 6.299', status: 'Enviado', data: '15 Mai 2026', pagamento: 'Cartão' },
  { id: '#ORD-5017', cliente: 'Beatriz Lima', itens: 4, valor: 'R$ 4.599', status: 'Enviado', data: '14 Mai 2026', pagamento: 'PIX' },
  { id: '#ORD-5016', cliente: 'Rafael Souza', itens: 1, valor: 'R$ 11.200', status: 'Entregue', data: '14 Mai 2026', pagamento: 'Cartão' },
  { id: '#ORD-5015', cliente: 'Fernanda Reis', itens: 2, valor: 'R$ 5.999', status: 'Cancelado', data: '13 Mai 2026', pagamento: 'PIX' },
  { id: '#ORD-5014', cliente: 'Lucas Pereira', itens: 1, valor: 'R$ 3.299', status: 'Entregue', data: '13 Mai 2026', pagamento: 'Cartão' },
  { id: '#ORD-5013', cliente: 'Juliana Mendes', itens: 3, valor: 'R$ 7.850', status: 'Pendente', data: '12 Mai 2026', pagamento: 'Boleto' },
  { id: '#ORD-5012', cliente: 'Pedro Alves', itens: 2, valor: 'R$ 9.100', status: 'Entregue', data: '12 Mai 2026', pagamento: 'PIX' },
];

// Products page
export const allProducts = [
  { nome: 'MacBook Pro M3', categoria: 'Eletrônicos', preco: 'R$ 12.499', estoque: 45, vendidos: 342, status: 'Ativo' },
  { nome: 'iPhone 16 Pro', categoria: 'Eletrônicos', preco: 'R$ 8.999', estoque: 128, vendidos: 521, status: 'Ativo' },
  { nome: 'Samsung Galaxy S25', categoria: 'Eletrônicos', preco: 'R$ 5.499', estoque: 89, vendidos: 289, status: 'Ativo' },
  { nome: 'iPad Air', categoria: 'Eletrônicos', preco: 'R$ 6.299', estoque: 0, vendidos: 198, status: 'Esgotado' },
  { nome: 'AirPods Max', categoria: 'Eletrônicos', preco: 'R$ 4.599', estoque: 210, vendidos: 445, status: 'Ativo' },
  { nome: 'Dell XPS 15', categoria: 'Eletrônicos', preco: 'R$ 11.200', estoque: 32, vendidos: 156, status: 'Ativo' },
  { nome: 'Apple Watch Ultra', categoria: 'Eletrônicos', preco: 'R$ 5.999', estoque: 67, vendidos: 234, status: 'Ativo' },
  { nome: 'Sony WH-1000XM6', categoria: 'Eletrônicos', preco: 'R$ 2.499', estoque: 15, vendidos: 389, status: 'Baixo' },
];

// Clients page
export const allClients = [
  { nome: 'Maria Silva', email: 'maria@email.com', pedidos: 12, gasto: 'R$ 45.200', desde: 'Jan 2025', status: 'VIP' },
  { nome: 'João Santos', email: 'joao@email.com', pedidos: 8, gasto: 'R$ 32.100', desde: 'Mar 2025', status: 'VIP' },
  { nome: 'Ana Costa', email: 'ana@email.com', pedidos: 5, gasto: 'R$ 18.900', desde: 'Jun 2025', status: 'Ativo' },
  { nome: 'Carlos Oliveira', email: 'carlos@email.com', pedidos: 15, gasto: 'R$ 52.300', desde: 'Nov 2024', status: 'VIP' },
  { nome: 'Beatriz Lima', email: 'beatriz@email.com', pedidos: 3, gasto: 'R$ 8.400', desde: 'Set 2025', status: 'Ativo' },
  { nome: 'Rafael Souza', email: 'rafael@email.com', pedidos: 7, gasto: 'R$ 28.600', desde: 'Abr 2025', status: 'Ativo' },
  { nome: 'Fernanda Reis', email: 'fernanda@email.com', pedidos: 2, gasto: 'R$ 5.200', desde: 'Dez 2025', status: 'Novo' },
  { nome: 'Lucas Pereira', email: 'lucas@email.com', pedidos: 1, gasto: 'R$ 3.299', desde: 'Mai 2026', status: 'Novo' },
];
