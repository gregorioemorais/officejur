# Arquitetura do OfficeJur

## Princípios

1. Um único repositório e uma única publicação.
2. Módulos funcionais independentes, evitando um aplicativo monolítico.
3. Componentes institucionais compartilhados em uma fonte única.
4. Dados e segredos fora do repositório.
5. Publicação contendo apenas os arquivos necessários para executar o sistema.

## Camadas

- `apps/portal`: entrada do sistema e ferramentas operacionais.
- `apps/documentos`: aplicações focadas na geração de documentos jurídicos.
- `apps/financeiro`: domínio financeiro e relacionamento entre clientes, casos e equipe.
- `apps/controle-pagamentos`: acompanhamento mensal simplificado de pagamentos.
- `apps/validador-projudi`: análise local de PDFs e assinaturas P7S, sem transmissão dos documentos.
- `packages/ui`: navegação e rodapé usados por todos os módulos.
- `apps/financeiro/worker`: integração protegida com o Mercado Pago.

## Dados

Os módulos iniciam sem dados operacionais versionados. Informações jurídicas e financeiras são mantidas no navegador e, quando configurado pelo usuário, sincronizadas com Gists privados.
