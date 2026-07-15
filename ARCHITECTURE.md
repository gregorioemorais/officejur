# Arquitetura do OfficeJur

## Princípios

1. Um único repositório e uma única publicação.
2. Módulos funcionais independentes, evitando um aplicativo monolítico.
3. Componentes institucionais compartilhados em uma fonte única.
4. Dados e segredos fora do repositório.
5. Preservação integral do histórico dos projetos de origem.

## Camadas

- `apps/portal`: entrada do sistema e ferramentas operacionais.
- `apps/documentos`: aplicações focadas na geração de documentos jurídicos.
- `apps/financeiro`: domínio financeiro e relacionamento entre clientes, casos e equipe.
- `apps/controle-pagamentos`: fluxo simplificado mantido durante a transição para o financeiro integrado.
- `packages/ui`: navegação e rodapé usados por todos os módulos.
- `workers`: reservado a integrações que exigem credenciais no servidor; o worker existente do Mercado Pago permanece dentro do módulo financeiro até uma futura extração.

## Decisão sobre o controle de pagamentos

O módulo foi preservado para evitar perda funcional e manter seu histórico. Como parte de suas funções se sobrepõe ao Financeiro Jurídico, novas funcionalidades devem preferencialmente ser implementadas no Financeiro. A remoção do módulo simplificado só deve ocorrer depois da migração confirmada dos dados e usuários.
