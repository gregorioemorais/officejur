# Financeiro Jurídico

Sistema financeiro estático para escritório de advocacia, pronto para GitHub Pages. Controla clientes, casos, honorários, recebimentos, despesas, custas, repasses, contas e inadimplência.

Os dados ficam no navegador e podem ser sincronizados com um Gist privado em **Configurações**. O token do GitHub nunca é gravado no repositório: permanece apenas no `localStorage` do navegador.

Não há etapa de build. Publique a raiz do repositório no GitHub Pages.

## Mercado Pago

O módulo **Cobranças** gera links do Checkout Pro vinculados aos recebíveis. Por segurança, a credencial privada não é armazenada na página estática.

Para configurar a integração sem terminal, siga o tutorial completo:

**[Tutorial de configuração do Mercado Pago](TUTORIAL-MERCADO-PAGO.md)**

O código do serviço protegido está em `worker/src/index.js`. Há também instruções resumidas para desenvolvedores em `worker/README.md`.
