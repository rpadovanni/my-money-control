# Arquitetura do Projeto

## Princípios Fundamentais

**Objetivo**: Simplicidade, clareza, escalabilidade sem over-engineering.

### Regras de Ouro

1. ✅ **Store Global Único**: Toda lógica de estado global fica em `src/shared/store`
2. ✅ **Slices Independentes**: Slices não se importam entre si; apenas a UI consome o store
3. ✅ **Tipagem Centralizada**: Toda tipagem de domínios fica em `src/shared/store/types`
4. ✅ **Sem Contexts de Estado**: Nenhum domínio possui contexto próprio ou store separado
5. ✅ **UI via Hooks**: A UI só acessa estado via hooks do store (`useStore`)
6. ✅ **Sem Over-Engineering**: Nada de padrões enterprise, DDD complexo ou sobre-modularização
7. ✅ **Prioridade**: Velocidade, organização e manutenibilidade

## Mapa de Dependências

```
(Global Store)
   |
   ├── user.slice          ← usado por: layout, header, profile-page
   |
   ├── settings.slice      ← usado por: theme-provider, currency formatter
   |
   ├── planning.slice      ← usado por: planning-page, charts, budget-calc
   |
   ├── transactions.slice  ← usado por: dashboard, statements, summaries
   |
   └── investments.slice   ← usado por: portfolio-page, charts, api-sync
```

**Importante**: Os slices são independentes e não se importam entre si. Apenas a UI consome múltiplos slices quando necessário.

## Estrutura de Pastas

```
src/
├── shared/
│   ├── store/              # Store global Zustand
│   │   ├── slices/         # Slices independentes (user, settings, planning, transactions, investments)
│   │   ├── types/          # Tipos TypeScript dos domínios
│   │   └── index.ts        # Store principal (único ponto de entrada)
│   ├── components/         # Componentes compartilhados
│   ├── hooks/              # Hooks compartilhados
│   └── utils/              # Utilitários compartilhados
├── features-new/           # Features da aplicação (usando store global)
├── pages/                  # Páginas da aplicação
└── components/             # Componentes UI (shadcn/ui)
```

## Store Global Zustand

### Localização
- **Arquivo**: `src/shared/store/index.ts`
- **Export**: `useStore` (único hook para acessar o store)

### Slices Disponíveis

1. **UserSlice** (`user.slice.ts`)
   - Estado: `user: User | null`
   - Ações: `setUser: (u: User | null) => void`
   - Uso: Dados do usuário logado

2. **SettingsSlice** (`settings.slice.ts`)
   - Estado: `settings: Settings`
   - Ações: `updateSettings: (partial: Partial<Settings>) => void`
   - Uso: Configurações da aplicação (tema, moeda, etc.)

3. **PlanningSlice** (`planning.slice.ts`)
   - Estado: `planning: PlanningState`
   - Ações: `setIncome`, `updateLimit`
   - Uso: Planejamento financeiro

4. **TransactionsSlice** (`transactions.slice.ts`)
   - Estado: `transactions: Transaction[]`
   - Ações: `addTransaction`, `removeTransaction`
   - Uso: Transações financeiras

5. **InvestmentsSlice** (`investments.slice.ts`)
   - Estado: `assets: Asset[]`
   - Ações: `updateAsset`
   - Uso: Investimentos e portfólio

### Padrão de Slice

```typescript
import type { StateCreator } from 'zustand';
import type { MyType } from '../types/my-type';

export interface MySlice {
  // Estado
  myData: MyType;
  
  // Ações
  updateMyData: (data: Partial<MyType>) => void;
}

export const createMySlice: StateCreator<MySlice> = (set) => ({
  myData: initialValue,
  updateMyData: (data) => set((s) => ({ 
    myData: { ...s.myData, ...data } 
  })),
});
```

### Uso do Store

```typescript
import { useStore } from '@/shared/store';

// Ler estado (seletor específico para evitar re-renders)
const theme = useStore((state) => state.settings.theme);
const user = useStore((state) => state.user);

// Atualizar estado
const updateSettings = useStore((state) => state.updateSettings);
updateSettings({ theme: 'dark' });

// Múltiplos valores (se necessário)
const { settings, user } = useStore((state) => ({
  settings: state.settings,
  user: state.user,
}));
```

## Tipos

Todos os tipos de domínio ficam em `src/shared/store/types/`:

- `user.ts` - Tipos relacionados ao usuário
- `settings.ts` - Tipos de configurações
- `planning.ts` - Tipos de planejamento
- `transactions.ts` - Tipos de transações
- `investments.ts` - Tipos de investimentos

**Regra**: Tipos são importados nos slices usando `import type`.

## Middleware

### Persistência

O store utiliza `persist` middleware para salvar automaticamente no `localStorage`:

```typescript
partialize: (state) => ({
  settings: state.settings,  // Persistido
  user: state.user,           // Persistido
  // Outros slices não são persistidos por padrão
})
```

### DevTools

O middleware `devtools` é aplicado apenas em desenvolvimento:

```typescript
import.meta.env.DEV
  ? devtools(persistedStore, { name: 'MyMoneyControl' })
  : persistedStore
```

## Regras de Implementação

### ✅ O Que Fazer

1. **Criar novos slices** seguindo o padrão acima
2. **Usar `useStore`** para acessar estado em componentes
3. **Centralizar tipos** em `src/shared/store/types`
4. **Manter slices independentes** (sem imports entre slices)
5. **Usar seletores específicos** para evitar re-renders desnecessários

### ❌ O Que NÃO Fazer

1. ❌ Criar contexts React para estado global
2. ❌ Criar stores separados por feature
3. ❌ Fazer slices importarem outros slices
4. ❌ Usar padrões enterprise complexos (DDD, CQRS, etc.)
5. ❌ Criar sistemas de diretórios complexos
6. ❌ Duplicar lógica de estado em múltiplos lugares

## Criando um Novo Slice

### Passo 1: Criar o Tipo

```typescript
// src/shared/store/types/my-domain.ts
export interface MyDomain {
  id: string;
  name: string;
  value: number;
}
```

### Passo 2: Criar o Slice

```typescript
// src/shared/store/slices/my-domain.slice.ts
import type { StateCreator } from 'zustand';
import type { MyDomain } from '../types/my-domain';

export interface MyDomainSlice {
  items: MyDomain[];
  addItem: (item: MyDomain) => void;
  removeItem: (id: string) => void;
}

export const createMyDomainSlice: StateCreator<MyDomainSlice> = (set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) => set((s) => ({ 
    items: s.items.filter((i) => i.id !== id) 
  })),
});
```

### Passo 3: Adicionar ao Store

```typescript
// src/shared/store/index.ts
import type { MyDomainSlice } from './slices/my-domain.slice';
import { createMyDomainSlice } from './slices/my-domain.slice';

export type GlobalState = 
  & UserSlice 
  & SettingsSlice 
  & PlanningSlice 
  & TransactionsSlice 
  & InvestmentsSlice
  & MyDomainSlice; // Adicionar aqui

const storeCreator: StateCreator<GlobalState> = (...a) => ({
  ...createUserSlice(...a),
  ...createSettingsSlice(...a),
  ...createPlanningSlice(...a),
  ...createTransactionsSlice(...a),
  ...createInvestmentsSlice(...a),
  ...createMyDomainSlice(...a), // Adicionar aqui
});
```

## Migração de Código Antigo

### De Jotai para Zustand

1. Identificar atoms Jotai que precisam migrar
2. Criar/atualizar slice correspondente no store
3. Substituir `useAtom`/`useAtomValue` por `useStore`
4. Remover atoms antigos após migração completa

### De Context para Zustand

1. Identificar Context que gerencia estado global
2. Criar slice correspondente no store
3. Substituir `useContext` por `useStore`
4. Remover Context após migração completa

## Convenções

### Nomenclatura

- **Slices**: `[Domain]Slice` (ex: `SettingsSlice`)
- **Criadores**: `create[Domain]Slice` (ex: `createSettingsSlice`)
- **Tipos**: PascalCase (ex: `Settings`, `Transaction`)
- **Ações**: camelCase (ex: `updateSettings`, `addTransaction`)

### Imports

- Use `import type` para tipos quando `verbatimModuleSyntax` está habilitado
- Prefira imports absolutos: `@/shared/store`
- Slices importam apenas tipos, nunca outros slices

## Performance

### Seletores Específicos

✅ **Bom** (evita re-renders desnecessários):
```typescript
const theme = useStore((state) => state.settings.theme);
```

❌ **Ruim** (causa re-render em qualquer mudança):
```typescript
const state = useStore(); // Acessa todo o estado
const theme = state.settings.theme;
```

### Múltiplos Valores

Se precisar de múltiplos valores, use um objeto:

```typescript
const { settings, user } = useStore((state) => ({
  settings: state.settings,
  user: state.user,
}));
```

## Checklist de Refatoração

Ao refatorar código para seguir esta arquitetura:

- [ ] Estado global movido para slice no store
- [ ] Tipos movidos para `src/shared/store/types`
- [ ] Contexts de estado removidos
- [ ] Hooks atualizados para usar `useStore`
- [ ] Imports de slices corrigidos (sem dependências entre slices)
- [ ] Seletores específicos usados (não acessar todo o estado)

## Próximos Passos

1. Completar migração de Jotai para Zustand
2. Remover dependência de Jotai do projeto
3. Consolidar tipos duplicados
4. Adicionar testes para slices críticos
