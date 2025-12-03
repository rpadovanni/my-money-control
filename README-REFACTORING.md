# Refatoração da Arquitetura - My Money Control

## Nova estrutura simplificada

A estrutura do projeto foi refatorada para uma arquitetura mais simples e objetiva:

### Features implementadas (8 módulos principais):

1. **transactions** - Despesas + Receitas unificadas
2. **credit-card** - Cartões, compras, faturas e orçamento
3. **fixed-costs** - Custos fixos e assinaturas
4. **budget** - Orçamento mensal por categoria
5. **metrics** - Burn rate, saving rate e distribuição
6. **dashboard** - Visão geral das finanças
7. **checklist** - Checklist mensal e semanal
8. **settings** - Tema e configurações

### Diretório shared

Contém utilitários e componentes reutilizáveis:

- `utils/` - Formatadores e funções de data
- `hooks/` - Hooks reutilizáveis
- `components/` - Componentes UI compartilhados

### Regras da nova arquitetura:

1. **Nenhum atom exportado diretamente**
   - Apenas selectors são expostos via index.ts
   - Hooks encapsulam todo acesso ao estado

2. **Separação clara**:
   - `atoms.ts` - Estado interno (privado)
   - `selectors.ts` - Cálculos derivados (públicos via index.ts)
   - `hooks.ts` - API pública para manipular estado
   - `service.ts` - Lógica de negócio/API (funções puras)
   - `utils.ts` - Funções utilitárias

3. **Imports via selectors**:
   - Features não importam atoms de outras features
   - Apenas selectors são importados para agregação
   - Exemplo: `metrics` importa selectors de `transactions`, `credit-card`, etc.

### Estrutura de arquivos por feature:

```
features-new/<feature-name>/
  ├── atoms.ts              # Estado interno (não exportado)
  ├── selectors.ts          # Cálculos derivados (exportados)
  ├── hooks.ts              # API pública
  ├── service.ts            # Lógica de negócio
  ├── types.ts              # Tipos TypeScript
  ├── utils.ts              # Funções utilitárias
  ├── components/           # Componentes UI
  ├── <FeatureName>.tsx     # Página principal
  └── index.ts              # Barrel export (API pública)
```

### Como testar a nova arquitetura:

1. A pasta `features-new/` contém toda a nova estrutura
2. Arquivos `App-new.tsx` e `Navbar-new.tsx` foram criados
3. Para testar, renomeie:
   - `src/main.tsx`: trocar import de `./App` para `./App-new`
   - Ou renomeie `App-new.tsx` para `App.tsx` (após backup do original)

### Status atual:

✅ Estrutura de diretórios criada
✅ Todos os arquivos boilerplate criados
✅ Imports e exports configurados
✅ Shared utils/hooks/components criados
✅ App-new.tsx e Navbar-new.tsx prontos

⚠️ **Próximos passos** (NÃO implementados - apenas estrutura):

- Migrar lógica dos componentes antigos
- Implementar formulários
- Implementar tabelas
- Implementar gráficos
- Testar integração entre features

### Comparação: Antigo vs Novo

**Antigo** (13 features):

- expenses, income (separados)
- credit-card
- fixed-costs
- health (removido)
- budgets
- savings-goals (removido - pode ser adicionado depois)
- investments (nova feature, mantida separada)
- investing (legado, pode ser removido)
- metrics
- dashboard
- checklist
- settings

**Novo** (8 features):

- transactions (expenses + income unificados)
- credit-card
- fixed-costs
- budget
- metrics
- dashboard
- checklist
- settings

### Benefícios da nova arquitetura:

1. **Menos navegação** - 8 features vs 13
2. **Transações unificadas** - entrada única para receitas e despesas
3. **Selectors claros** - agregação via selectors, não atoms diretos
4. **Shared** - utilitários centralizados
5. **Imports corretos** - sem violação de encapsulamento
6. **Mais simples** - foco no essencial

### Observações:

- A feature `investments` (nova) pode ser integrada depois
- A feature `investing` (legado) **DEVE SER MANTIDA** - será usada como base para outra funcionalidade
- Health foi removida (custos de saúde podem ir em fixed-costs ou transactions)
- Savings-goals foi removida (pode ser adicionada depois se necessário)
