# Instruções Detalhadas para Construção da Plataforma Financeira Modular

Estas instruções descrevem como o agente deve gerar todo o código da plataforma usando React + TypeScript + Vite, com arquitetura modular baseada em features, Jotai para estado, shadcn/ui como lib principal de componentes, e seguindo rigorosamente os princípios DRY e YAGNI.

---

# 1. Stack e Bibliotecas

## Core

- React
- TypeScript
- Vite
- pnpm

## UI e Componentes

- shadcn/ui (componente principal)
- Recharts (via shadcn, componente Chart)
- Lucide Icons (via shadcn)
- framer-motion (caso necessário)

## Estado

- Jotai (estado global modular)
- jotai-devtools (opcional)

## Utilidades

- Zod (validação)
- date-fns (datas)
- axios ou fetch wrapper

---

# 2. Arquitetura Por Features

Cada feature deve seguir a estrutura:

```txt
src/features/<feature-name>/
    components/
    atoms/
    hooks/
    services/
    types/
    utils/
    index.ts
```

Princípios:

- Cada feature é **auto-contida**.
- Não há importações cruzadas entre features, exceto via _shared_.
- A pasta `shared/` contém utilitários e componentes genéricos.

---

# 3. Estado Com Jotai (Guia Modular)

### Regras gerais:

- Cada feature define seus próprios átomos em `atoms/`.
- Os átomos NUNCA são exportados diretamente; expor apenas _hooks_.
- Sempre criar:
  - `atoms/mainAtoms.ts`
  - `hooks/useFeatureState.ts` (wrapper dos átomos)
  - `services/featureService.ts`

### Exemplo:

```ts
// atoms/index.ts
import { atom } from 'jotai';

export const cartItemsAtom = atom<CartItem[]>([]);
export const cartTotalAtom = atom((get) => get(cartItemsAtom).reduce((acc, item) => acc + item.price, 0));

// hooks/useCart.ts
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { cartItemsAtom, cartTotalAtom } from '../atoms';

export function useCart() {
  const [items, setItems] = useAtom(cartItemsAtom);
  const total = useAtomValue(cartTotalAtom);

  return {
    items,
    total,
    addItem: (item: CartItem) => setItems((prev) => [...prev, item]),
    clear: () => setItems([]),
  };
}
```

# 4. Fluxo de Implementação por Feature

Cada feature deve fornecer:

1. UI
   - Componentes em components/
   - Sempre priorizar shadcn/ui
   - Variações devem ser props, não componentes duplicados

2. Estado
   - Átomos simples
   - Derivados para cálculos
   - Hooks para manipulação

3. Serviços
   - async functions
   - Nunca colocar lógica pesada na UI

4. Schemas (Zod)
   - Tipos e validações

5. Exposed API
   - Apenas através de:
     - hooks/
     - components/
     - index.ts

# 5. DRY e YAGNI

### DRY:

- Detectou repetição?
  - → Criar shared/utils ou shared/hooks.

### YAGNI:

- Nunca criar:
  - abstrações antecipadas
  - camadas extras
  - estados que ainda não são necessários
  - hooks genéricos sem motivo

# 6. Lista de Features Iniciais

- Dashboard
- Controle de gastos mensais
- Cartão de crédito
- Contas fixas
- Orçamentos (limits)
- Metas
- Investimentos
- Relatórios e gráficos

# 7. Regras de Geração de Código

- Sempre gerar componentes funcionais em React.
- Usar Tailwind (já integrado ao shadcn).
- Evitar useEffect desnecessário.
- Preferir useAtom a manipular estados locais.
- Se precisar de dados mockados, gerar fixtures/.

# 8. Estrutura Recomendada do Projeto

```txt
src/
  app/
  features/
    budgets/
    credit-card/
    dashboard/
    expenses/
    fixed-costs/
    goals/
    investments/
    reports/
  shared/
    components/
    hooks/
    utils/
    styles/
  main.tsx
```

# 9. Convenções de Código

### Importações

- Primeiro libs externas
- Depois shared
- Depois feature local

### Nomenclatura

- Átomos: somethingAtom
- Hooks: useSomething
- Serviços: somethingService.ts
- Components: PascalCase

# 10. Como Gerar Funcionalidades no Cursor

Quando uma feature for pedida:

1. Criar pasta da feature.
2. Criar átomos.
3. Criar hooks.
4. Criar types.
5. Criar serviços.
6. Criar componentes.
7. Gerar index.ts de export.

Sempre seguindo estas instruções.
