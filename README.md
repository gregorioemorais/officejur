# Financeiro Jurídico

Sistema financeiro estático para escritório de advocacia, pronto para GitHub Pages. Controla clientes, casos, honorários, recebimentos, despesas, custas, repasses, contas e inadimplência.

Clientes e casos possuem cadastros independentes. O cliente reúne dados pessoais e de contato; nome completo, CPF válido, data de nascimento e telefone são obrigatórios. Telefones marcados como WhatsApp possuem atalho direto para conversa.

Todo processo ou caso judicial, administrativo, extrajudicial ou consultivo deve apontar para um cliente previamente cadastrado. O sistema bloqueia casos sem cliente e também impede excluir clientes que ainda possuam casos. Cada caso pode ter honorários próprios ou estar incluído na contratação geral do cliente.

O módulo **Equipe** cadastra sócios, advogados, associados, estagiários, administrativos, correspondentes e prestadores. Em cada caso é possível definir responsáveis, tipo de atuação e percentual de participação. A projeção individual considera somente receitas realizadas e vinculadas ao caso; receitas gerais de pacotes permanecem separadas.

Os dados ficam no navegador e podem ser sincronizados com um Gist privado em **Configurações**. O token do GitHub nunca é gravado no repositório: permanece apenas no `localStorage` do navegador.

Não há etapa de build. Publique a raiz do repositório no GitHub Pages.

## Mercado Pago

O módulo **Cobranças** gera links do Checkout Pro vinculados aos recebíveis. Por segurança, a credencial privada não é armazenada na página estática.

Para configurar a integração sem terminal, siga o tutorial completo:

**[Tutorial de configuração do Mercado Pago](TUTORIAL-MERCADO-PAGO.md)**

O código do serviço protegido está em `worker/src/index.js`. Há também instruções resumidas para desenvolvedores em `worker/README.md`.
