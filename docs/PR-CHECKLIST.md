# Checklist de Pull Request

Este checklist garante que as mudanças mantêm a simplicidade e qualidade do código.

## Antes de Criar o PR

### ✅ Código

- [ ] Código segue as convenções do projeto (ver `docs/architecture.md`)
- [ ] Imports de tipos usam `import type` quando necessário
- [ ] Não há imports não utilizados
- [ ] Não há código comentado desnecessário
- [ ] Funções e componentes têm responsabilidades claras

### ✅ Estado

- [ ] Mudanças de estado usam o store global (`useStore`) quando apropriado
- [ ] Não foram criados novos atoms Jotai (use Zustand)
- [ ] Não foram criados novos contexts React (use Zustand)
- [ ] Estado local é usado apenas quando não precisa ser compartilhado

### ✅ TypeScript

- [ ] Sem erros de tipo (`tsc --noEmit`)
- [ ] Tipos estão definidos em `src/shared/store/types/` quando compartilhados
- [ ] Interfaces seguem convenções de nomenclatura

### ✅ Testes

- [ ] Funcionalidade testada manualmente
- [ ] Não quebrou funcionalidades existentes
- [ ] Edge cases considerados

### ✅ Performance

- [ ] Seletores do Zustand são específicos (evitar re-renders desnecessários)
- [ ] Não há loops infinitos ou re-renders excessivos
- [ ] Dados grandes são tratados adequadamente

## Estrutura do PR

### 📝 Descrição

- [ ] Descrição clara do que foi alterado
- [ ] Motivação para a mudança
- [ ] Screenshots (se aplicável)
- [ ] Breaking changes documentados (se houver)

### 🔗 Relacionado

- [ ] Issues relacionadas mencionadas
- [ ] PRs relacionados mencionados

## Revisão

### 👀 Auto-revisão

- [ ] Código revisado pelo autor
- [ ] Linter passou (`pnpm lint`)
- [ ] Formatação correta (`pnpm format:check`)
- [ ] Build funciona (`pnpm build`)

### 🎯 Foco

- [ ] PR focado em uma única funcionalidade/correção
- [ ] Não mistura refatorações com novas features
- [ ] Commits são atômicos e bem descritos

## Regras Especiais

### 🚫 Não Fazer

- ❌ Criar novos atoms Jotai
- ❌ Criar novos contexts React para estado global
- ❌ Duplicar lógica de estado
- ❌ Misturar lógica de negócio em componentes
- ❌ Adicionar dependências sem justificativa

### ✅ Fazer

- ✅ Usar `useStore` do Zustand para estado global
- ✅ Criar slices no store quando necessário
- ✅ Manter componentes simples e focados
- ✅ Extrair lógica complexa para hooks ou utils
- ✅ Documentar decisões arquiteturais importantes

## Checklist Específico por Tipo de Mudança

### Nova Feature

- [ ] Slice criado/atualizado se necessário
- [ ] Tipos definidos em `src/shared/store/types/`
- [ ] Componentes seguem padrões existentes
- [ ] Documentação atualizada (se necessário)

### Refatoração

- [ ] Comportamento mantido (sem breaking changes)
- [ ] Código mais simples/legível após refatoração
- [ ] Performance mantida ou melhorada

### Bug Fix

- [ ] Causa raiz identificada
- [ ] Fix não introduz novos bugs
- [ ] Teste manual realizado

### Migração (Jotai → Zustand)

- [ ] Todos os usos do atom antigo foram migrados
- [ ] Atom antigo removido
- [ ] Funcionalidade testada após migração
- [ ] Nenhum import de Jotai relacionado permanece

## Aprovação

- [ ] Pelo menos 1 aprovação de revisor
- [ ] Todos os comentários resolvidos
- [ ] CI/CD passou
- [ ] Conflitos resolvidos (se houver)

---

**Nota**: Este checklist deve ser seguido para manter a qualidade e simplicidade do código. Se algo não se aplica ao seu PR, marque como N/A na descrição.

