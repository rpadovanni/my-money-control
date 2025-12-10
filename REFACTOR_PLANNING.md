# 📝 Refactor de Planejamento — Guia Monolítico Zustand

## Objetivo

Migrar para uma arquitetura monolítica simples, centralizando o estado global em Zustand e consolidando toda a lógica de planejamento financeiro em uma única página: `PlanningPage`.  
Tecnologias: **Vite + React + TypeScript + shadcn/ui**.

---

## 1. Página Monolítica de Planejamento

Crie o arquivo:

```
src/pages/planning/PlanningPage.tsx
```

A página deve conter:

- Card de **Renda Mensal**
- Card de **Limites de Categoria**
- **Lista** exibindo todos os limites do store
- **Botão** "Adicionar limite"
- **Modal** (shadcn/ui) para criar/editar limite
- Card de **Distribuição** com gráfico (shadcn chart)

> **Atenção**:
>
> - Todos os dados vêm diretamente do Zustand
> - **Nenhuma** lógica de cálculo na UI (apenas consumo do estado)

---

## 2. Store Zustand — Planejamento

Crie/atualize:

```
src/store/planning.slice.ts
```

Definição dos tipos:

```typescript
export interface LimitCategory {
  id: string;
  category: string;
  amount: number;
}

export interface PlanningState {
  monthlyIncome: number;
  limits: LimitCategory[];
  setMonthlyIncome(value: number): void;
  addLimit(limit: Omit<LimitCategory, 'id'>): void;
  updateLimit(id: string, data: Partial<LimitCategory>): void;
  removeLimit(id: string): void;

  // cálculos
  getTotalLimits(): number;
  getRemaining(): number;
  getUsedPercentage(): number;
}
```

Monte o store global:

```
src/store/index.ts
```

```typescript
import { create } from 'zustand';
import { createPlanningSlice } from './planning.slice';

export const useStore = create((...args) => ({
  planning: createPlanningSlice(...args),
}));
```

Uso na UI:

```typescript
const income = useStore((s) => s.planning.monthlyIncome);
const setIncome = useStore((s) => s.planning.setMonthlyIncome);
```

---

## 3. Centralizar e Eliminar Estados Dispersos

- **Remova completamente**:
  - Contexts
  - átomos Jotai
  - reducers
  - Feature modules separados
  - Hooks redundantes de estado

- Mova a lógica antiga para funções puras **no slice**:
  - Soma dos limites
  - Porcentagem utilizada
  - Saldo restante
  - Total planejado vs renda mensal
  - Validações

> **Nenhum cálculo na UI.**

---

## 4. Refatoração de Componentes

Migre componentes antigos de:

- Renda mensal
- Budgets/limites/metas
- Distribuição percentual
- Histórico mensal (se houver)

Para:

```
src/pages/planning/components/
```

Todos os componentes devem ser **dumbs**: só recebem props ou leem do store via hook.

---

## 5. Componentes shadcn/ui — Planejamento

Crie os arquivos:

```
src/pages/planning/components/IncomeCard.tsx
src/pages/planning/components/LimitCard.tsx
src/pages/planning/components/LimitList.tsx
src/pages/planning/components/LimitModal.tsx
src/pages/planning/components/DistributionChart.tsx
```

Todos devem consumir Zustand via `useStore`.

---

## 6. Limpeza de Código Legado

- Delete:
  - Pastas/arquivos antigos de feature modularizada
  - Hooks de estado redundantes
  - Contexts, reducers, factories, átomos
  - Cálculos replicados em componentes

> **Objetivo:**
>
> - Menos arquivos
> - Menos abstração
> - Só uma fonte de verdade (Zustand)

---

## 7. Normalização de Dados

- Dados antigos como `budgets`, `metas`, `categorias` diferentes:
  - Converta tudo para o formato:

    ```typescript
    { id: string, category: string, amount: number }
    ```

  - E coloque em `limits` do slice.

---

## 8. Tipagem 100% Estática

- **Proíba**: any, implicit any
- Tipos **centralizados** no slice
- Componentes sempre importam tipos do store

---

## 9. Remove Arquitetura Modular Antiga

- Apague:
  - Pastas de feature
  - Barrels desnecessários
  - Organização complexa/over-engineered
  - Dependências cruzadas entre módulos

> Resultado esperado:
>
> - Leve
> - Centralizado
> - `/store`, `/pages/planning`, componentes simples

---

## 10. Garantindo Autonomia da PlanningPage

A `PlanningPage` deve:

- Renderizar renda mensal
- Permitir alterar a renda
- Renderizar limites das categorias
- Permitir criar, editar, remover limites
- Mostrar total utilizado, porcentagem, gráfico de distribuição
- Funcionar **sem nenhum outro sistema externo**

---

## 11. Ajustes Finais

- Remova imports quebrados
- Atualize paths conforme a nova estrutura
- Certifique-se que tudo compila corretamente
