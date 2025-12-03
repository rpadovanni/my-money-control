# Notas de Migração - Unificação Expenses + Income

## ✅ Refatoração Completa Realizada

### 1. Nova Feature `transactions` Criada

A feature `transactions` unifica `expenses` e `income` em uma única estrutura:

**Tipo Transaction:**
```typescript
{
  id: string
  date: string          // ISO string
  category: string
  value: number
  type: "income" | "expense"
  paymentMethod?: "pix" | "debit" | "credit-card"
  creditCardId?: string
  notes?: string
}
```

### 2. Componentes Criados

- ✅ **TransactionForm** - Formulário único para receitas e despesas
  - Muda campos dinamicamente baseado no tipo
  - Mostra paymentMethod apenas para expenses
  - Mostra creditCardId quando paymentMethod é credit-card

- ✅ **TransactionTable** - Tabela única usando Table do shadcn/ui
  - Filtros por tipo (receitas/despesas)
  - Badges coloridos para diferenciar tipos
  - Ações de editar e deletar

- ✅ **TransactionFilters** - Componente de filtros
  - Por tipo, categoria, forma de pagamento
  - Por período (data inicial/final)

### 3. Atoms e Selectors Migrados

**Atoms (privados):**
- `transactionsAtom` - Lista de todas as transações
- `transactionFiltersAtom` - Filtros ativos

**Selectors (públicos):**
- `filteredTransactionsAtom` - Transações filtradas
- `expensesAtom` - Apenas despesas
- `incomesAtom` - Apenas receitas
- `totalExpensesAtom` - Total de despesas
- `totalIncomesAtom` - Total de receitas
- `currentMonthExpensesAtom` - Despesas do mês atual
- `currentMonthIncomesAtom` - Receitas do mês atual
- `currentMonthExpensesTotalAtom` - Total de despesas do mês
- `currentMonthIncomesTotalAtom` - Total de receitas do mês
- `expensesByCategoryAtom` - Despesas agrupadas por categoria
- `expensesByPaymentMethodAtom` - Despesas por forma de pagamento
- `expensesByMonthAtom` - Despesas por mês
- `incomesByCategoryAtom` - Receitas por categoria

### 4. Features Atualizadas

#### ✅ Dashboard (`features-new/dashboard`)
- Usa `currentMonthExpensesTotalAtom` e `currentMonthIncomesTotalAtom`
- Usa `expensesByMonthAtom` para gráficos mensais
- Usa `savingRateAtom` de metrics

#### ✅ Metrics (`features-new/metrics`)
- Usa `currentMonthExpensesTotalAtom` e `currentMonthIncomesTotalAtom`
- Usa `expensesByCategoryAtom` para distribuição
- Calcula burn rate e saving rate corretamente

#### ✅ Budget (`features-new/budget`)
- Usa `expensesByCategoryAtom` de transactions
- Combina com credit-card e fixed-costs

### 5. Features Antigas Removidas

- ❌ `src/features/expenses/` - **REMOVIDA**
- ❌ `src/features/income/` - **REMOVIDA**

## ⚠️ Features Antigas que Precisam Atualização

As seguintes features antigas ainda importam `expenses` ou `income` e precisarão ser atualizadas:

1. **`src/features/dashboard/`** (antiga)
   - Importa `useExpenses` de `../../expenses/hooks`
   - **Solução**: Usar `useTransactions` de `features-new/transactions`

2. **`src/features/budgets/`** (antiga)
   - Importa `useExpenses` de `../../expenses/hooks`
   - **Solução**: Usar `expensesByCategoryAtom` de `features-new/transactions`

3. **`src/features/savings-goals/`** (antiga)
   - Importa `useExpenses` de `../../expenses/hooks`
   - **Solução**: Usar `totalExpensesAtom` de `features-new/transactions`

## 🔄 Próximos Passos

### Opção 1: Migrar Features Antigas
Atualizar as features antigas para usar a nova estrutura `transactions`:
- Atualizar imports
- Substituir `useExpenses()` por `useTransactions()`
- Ajustar código para trabalhar com o novo tipo `Transaction`

### Opção 2: Usar Nova Estrutura
Trocar para usar `features-new/` completamente:
- Atualizar `App.tsx` para usar `App-new.tsx`
- Atualizar `Navbar.tsx` para usar `Navbar-new.tsx`
- Migrar lógica restante das features antigas

## 📝 Diferenças Importantes

### Antes (Expenses):
```typescript
interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: Date;  // Date object
}
```

### Depois (Transactions):
```typescript
interface Transaction {
  id: string;
  date: string;  // ISO string
  category: TransactionCategory;
  value: number;  // renomeado de amount
  type: "income" | "expense";
  paymentMethod?: PaymentMethod;  // opcional
  creditCardId?: string;  // novo
  notes?: string;  // novo (substitui description)
}
```

### Mudanças Principais:
1. **date**: `Date` → `string` (ISO format)
2. **amount**: → `value`
3. **description**: → `notes` (opcional)
4. **type**: Novo campo obrigatório
5. **creditCardId**: Novo campo opcional
6. **paymentMethod**: Agora opcional (apenas para expenses)

## ✅ Checklist de Migração

- [x] Criar tipo Transaction unificado
- [x] Migrar atoms e selectors
- [x] Criar TransactionForm único
- [x] Criar TransactionTable única
- [x] Criar TransactionFilters
- [x] Atualizar hooks.ts
- [x] Atualizar Dashboard (nova estrutura)
- [x] Atualizar Metrics (nova estrutura)
- [x] Atualizar Budget (nova estrutura)
- [x] Remover features antigas expenses/ e income/
- [ ] Atualizar features antigas que ainda usam expenses/income
- [ ] Migrar dados existentes (se houver)
- [ ] Testar integração completa

## 🎯 Arquitetura Final

```
features-new/
  transactions/     ← Expenses + Income unificados
  credit-card/
  fixed-costs/
  budget/          ← Usa transactions selectors
  metrics/         ← Usa transactions selectors
  dashboard/       ← Usa transactions selectors
  checklist/
  settings/
```

Todas as features agregadoras (budget, metrics, dashboard) agora consomem apenas **selectors** da feature transactions, nunca atoms diretamente.

