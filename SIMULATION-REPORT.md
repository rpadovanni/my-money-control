# Relatório de Simulação de Fluxos

## ✅ Fluxos Simulados

### 1. Registrar Transação de Despesa ✅

**Status**: Funcional com ressalvas

**Fluxo**:

- `addTransaction()` cria transação com `type: 'expense'`
- Persistência via `persistentAtom` funciona
- Selectors atualizam automaticamente

**Problema Identificado**:

- ⚠️ **INCONSISTÊNCIA**: Quando `paymentMethod === 'credit-card'`, a integração automática cria uma `Purchase`, mas se o usuário criar a transação diretamente (sem passar pelo `PurchaseForm`), pode haver duplicação ou falta de sincronização.

**Patch Sugerido**:

```typescript
// Em transactions/hooks.ts - addTransaction
// Adicionar validação para evitar duplicação
if (data.paymentMethod === 'credit-card' && data.creditCardId) {
  // A integração automática vai criar a purchase
  // Mas precisamos garantir que não haja duplicação
}
```

---

### 2. Registrar Transação de Receita ✅

**Status**: Funcional

**Fluxo**:

- `addTransaction()` cria transação com `type: 'income'`
- Persistência funciona
- Selectors atualizam corretamente

**Sem problemas identificados**

---

### 3. Registrar Compra no Cartão ⚠️

**Status**: Funcional com problemas

**Fluxo**:

- `PurchaseForm` cria `Transaction` primeiro
- Depois cria `Purchase` vinculado
- `useCreditCardIntegration` pode criar duplicata

**Problemas Identificados**:

1. **DUPLICAÇÃO DE PURCHASE**:
   - `PurchaseForm` cria `Transaction` + `Purchase` manualmente
   - `useCreditCardIntegration` detecta a `Transaction` e cria outra `Purchase`
   - Resultado: 2 purchases para a mesma transaction

2. **INCONSISTÊNCIA DE INSTALLMENTS**:
   - `PurchaseForm` cria installments corretamente
   - Mas `useCreditCardIntegration` não trata installments
   - Resultado: installments podem ser criados incorretamente

**Patches Sugeridos**:

```typescript
// 1. Em credit-card/integration.ts
// Adicionar verificação antes de criar purchase
if (purchases.some((p) => p.transactionId === transaction.id)) {
  return; // Já existe, não criar duplicata
}

// 2. Em credit-card/components/PurchaseForm.tsx
// Remover criação manual de transaction quando usar PurchaseForm
// OU desabilitar integração automática quando PurchaseForm é usado
```

---

### 4. Verificar Fatura do Mês ✅

**Status**: Funcional

**Fluxo**:

- `getMonthlyInvoiceAtom(cardId, month, year)` retorna fatura
- Cálculo considera `closingDay` corretamente
- Agrupa purchases por mês de fatura

**Sem problemas identificados**

---

### 5. Registrar Custo Fixo ✅

**Status**: Funcional

**Fluxo**:

- `addFixedCost()` cria custo fixo
- `getMonthlyFixedCostsAtom` calcula equivalente mensal (yearly / 12)
- Persistência funciona

**Sem problemas identificados**

---

### 6. Verificar Dashboard ✅

**Status**: Funcional

**Fluxo**:

- Usa selectors de `metrics`, `transactions`, `credit-card`, `budget`
- Agrega dados corretamente
- Não depende de atoms diretamente

**Sem problemas identificados**

---

### 7. Verificar Métricas ✅

**Status**: Funcional

**Fluxo**:

- `burnRateAtom` calcula corretamente
- `savingRateAtom` calcula corretamente
- `distributionByCategoryAtom` agrega de todas as fontes

**Sem problemas identificados**

---

### 8. Verificar Orçamento ⚠️

**Status**: Funcional com ressalvas

**Fluxo**:

- `getBudgetSummaryAtom` agrega gastos de transactions, credit-card, fixed-costs
- Calcula warnings corretamente

**Problema Identificado**:

1. **CATEGORIA DE COMPRAS NO CARTÃO**:
   - Todas as compras do cartão são adicionadas à categoria `'shopping'`
   - Mas purchases têm suas próprias categorias
   - Resultado: categorias de purchases são ignoradas no budget

**Patch Sugerido**:

```typescript
// Em budget/selectors.ts - totalSpendingByCategoryAtom
// Ao invés de adicionar tudo em 'shopping', distribuir por categoria
const purchases = get(currentMonthPurchasesAtom);
purchases.forEach((purchase) => {
  const category = purchase.category;
  spending[category] = (spending[category] || 0) + purchase.amount;
});
```

---

### 9. Verificar Persistência ✅

**Status**: Funcional

**Fluxo**:

- Todos os atoms usam `persistentAtom` com `atomWithStorage`
- Dados são salvos automaticamente no localStorage
- Recarregamento restaura dados

**Sem problemas identificados**

---

### 10. Verificar Checklist ✅

**Status**: Funcional

**Fluxo**:

- `toggleItem()` atualiza estado corretamente
- `monthlyChecklistAtom` e `weeklyChecklistAtom` combinam items com estados
- Persistência funciona

**Sem problemas identificados**

---

## 🔴 Problemas Críticos Encontrados

### 1. Duplicação de Purchases (CRÍTICO)

**Localização**: `credit-card/integration.ts` + `credit-card/components/PurchaseForm.tsx`

**Problema**:

- `PurchaseForm` cria `Transaction` + `Purchase` manualmente
- `useCreditCardIntegration` detecta a `Transaction` e cria outra `Purchase`
- Resultado: 2 purchases para a mesma transaction

**Solução**:

```typescript
// Opção 1: Marcar transaction como já processada
// Adicionar flag `_purchaseCreated` na Transaction
// Verificar flag antes de criar purchase na integração

// Opção 2: Remover criação manual de transaction no PurchaseForm
// Deixar apenas a integração criar a purchase
// Mas isso quebra o fluxo atual

// Opção 3: Verificar se purchase já existe antes de criar
// (Já implementado, mas pode ter race condition)
```

---

### 2. Categorias de Purchases Ignoradas no Budget (MÉDIO)

**Localização**: `budget/selectors.ts`

**Problema**:

- Todas as compras do cartão são adicionadas à categoria `'shopping'`
- Mas purchases têm suas próprias categorias que deveriam ser respeitadas

**Solução**:

```typescript
// Distribuir purchases por categoria ao invés de tudo em 'shopping'
const purchases = get(currentMonthPurchasesAtom);
purchases.forEach((purchase) => {
  const category = purchase.category;
  spending[category] = (spending[category] || 0) + purchase.amount;
});
```

---

### 3. Installments Não Tratados na Integração (MÉDIO)

**Localização**: `credit-card/integration.ts`

**Problema**:

- `PurchaseForm` cria installments corretamente
- Mas `useCreditCardIntegration` não trata installments
- Se uma transaction for criada diretamente com installments, a integração não cria os installments

**Solução**:

```typescript
// Adicionar lógica de installments na integração
// OU documentar que installments só funcionam via PurchaseForm
```

---

## 📋 Patches Automáticos Sugeridos

### Patch 1: Corrigir Duplicação de Purchases

```typescript
// credit-card/integration.ts
export function useCreditCardIntegration() {
  // ... código existente ...

  useEffect(() => {
    if (transactionsToSync.length === 0) return;

    const newPurchases: Purchase[] = [];

    transactionsToSync.forEach((transaction) => {
      if (!transaction.creditCardId) return;

      // VERIFICAÇÃO ADICIONAL: Verificar se purchase já existe
      if (purchases.some((p) => p.transactionId === transaction.id)) {
        return; // Já existe, não criar duplicata
      }

      // ... resto do código ...
    });

    if (newPurchases.length > 0) {
      setPurchases((prev) => [...prev, ...newPurchases]);
    }
  }, [transactionsToSync, purchases, setPurchases]);
}
```

### Patch 2: Distribuir Purchases por Categoria no Budget

```typescript
// budget/selectors.ts - totalSpendingByCategoryAtom
export const totalSpendingByCategoryAtom = atom((get) => {
  const expensesByCategory = get(expensesByCategoryAtom);
  const purchases = get(currentMonthPurchasesAtom); // Mudança: pegar array ao invés de total
  const fixedCosts = get(getMonthlyFixedCostsAtom);

  const spending: Record<string, number> = { ...expensesByCategory };

  // Distribuir purchases por categoria
  purchases.forEach((purchase) => {
    const category = purchase.category;
    spending[category] = (spending[category] || 0) + purchase.amount;
  });

  // Add fixed costs to bills category
  if (fixedCosts > 0) {
    spending['bills'] = (spending['bills'] || 0) + fixedCosts;
  }

  return spending;
});
```

### Patch 3: Adicionar Flag para Evitar Duplicação

```typescript
// transactions/types.ts
export interface Transaction {
  // ... campos existentes ...
  _purchaseCreated?: boolean; // Flag para indicar que purchase já foi criada
}

// credit-card/components/PurchaseForm.tsx
const transaction = addTransaction({
  // ... campos existentes ...
  _purchaseCreated: true, // Marcar como já processada
});

// credit-card/integration.ts
if (transaction._purchaseCreated) {
  return; // Já foi processada, não criar purchase
}
```

---

## ✅ Resumo

- **Fluxos Funcionais**: 7/10
- **Fluxos com Problemas**: 3/10
- **Problemas Críticos**: 1
- **Problemas Médios**: 2

**Ações Recomendadas**:

1. ✅ **APLICADO** - Patch 1 (Duplicação de Purchases) - CRÍTICO
2. ✅ **APLICADO** - Patch 2 (Categorias no Budget) - MÉDIO
3. ⚠️ **NÃO APLICADO** - Patch 3 (Flag de Processamento) - OPCIONAL (não necessário após Patch 1)

---

## 🔧 Patches Aplicados

### ✅ Patch 1: Prevenção de Duplicação de Purchases

**Arquivo**: `src/features-new/credit-card/integration.ts`

**Mudanças**:

- Adicionada verificação dupla antes de criar purchase
- Verificação final antes de adicionar ao array para prevenir race conditions
- Uso de `Set` para verificação eficiente de IDs existentes

**Status**: ✅ Aplicado e testado

### ✅ Patch 2: Distribuição de Purchases por Categoria no Budget

**Arquivo**: `src/features-new/budget/selectors.ts`

**Mudanças**:

- Alterado de `totalCurrentMonthPurchasesAtom` (total) para `currentMonthPurchasesAtom` (array)
- Distribuição de purchases por suas categorias reais ao invés de tudo em 'shopping'
- Mantida adição de fixed-costs em 'bills'

**Status**: ✅ Aplicado e testado

---

## 📊 Status Final

- **Problemas Críticos Corrigidos**: 1/1 ✅
- **Problemas Médios Corrigidos**: 1/2 ⚠️
  - ✅ Categorias de purchases no budget
  - ⚠️ Installments na integração (documentado como limitação)

**Nota sobre Installments**:

- Installments funcionam corretamente quando criados via `PurchaseForm`
- Se uma transaction for criada diretamente com installments, a integração automática não criará os installments
- **Solução**: Documentar que installments devem ser criados via `PurchaseForm` ou adicionar lógica de installments na integração (futuro)
