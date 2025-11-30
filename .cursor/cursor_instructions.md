# Cursor Instructions (Arquivo Base)

Você é responsável por gerar código para um sistema React + TypeScript + Vite organizado em arquitetura modular por features.

## Diretrizes Gerais

- Usar **pnpm** para instalar dependências.
- Utilizar **shadcn/ui** como biblioteca principal de componentes.
- Evitar criar componentes do zero quando houver equivalente no shadcn/ui.
- Usar princípios **DRY** e **YAGNI** sempre.
- Manter a arquitetura _por features_, com escopo independente.
- Utilizar **Jotai** como gerenciador de estado global simples e modular.
- Evitar lógicas complexas; preferir clareza, simplicidade e separação de responsabilidades.

## Organização

Para decisões arquiteturais, estrutura de pastas, fluxos de estado, features, padrões e exemplos completos, consulte o arquivo:
**cursor_instructions_detailed.md**

## Como agir

- Sempre gerar código seguindo a arquitetura modular.
- Criar estruturas de feature completas (componentes, hooks, átomos, services).
- Nunca inventar necessidades — siga YAGNI: implemente apenas o que foi pedido.
- Evite duplicação — se notar repetição, abstraia para utilitários ou hooks.
- Prefira componentes prontos do shadcn/ui quando possível.

## Importante

Estas instruções DEVEM ser aplicadas em qualquer geração de código ou refatoração enquanto este arquivo estiver no contexto via `/add`.
