# Financeiro Jurídico

Módulo financeiro do OfficeJur. Controla clientes, casos, honorários, recebimentos, despesas, custas, repasses, contas e inadimplência.

Clientes e casos possuem cadastros independentes. O cliente reúne dados pessoais e de contato; nome completo, CPF válido, data de nascimento e telefone são obrigatórios. Telefones marcados como WhatsApp possuem atalho direto para conversa.

Todo processo ou caso judicial, administrativo, extrajudicial ou consultivo deve apontar para um cliente previamente cadastrado. O sistema bloqueia casos sem cliente e também impede excluir clientes que ainda possuam casos ou pacotes.

Cada caso pode ter contratação própria, integrar um pacote de honorários específico ou deixar a contratação em branco. Um mesmo cliente pode possuir vários pacotes. Todos os casos vinculados ao mesmo pacote exibem os valores contratado, recebido e em aberto de forma conjunta.

As condições financeiras contemplam valor à vista, entrada com parcelas, mensalidades, etapas, êxito, contratação mista e condição personalizada. Valores fixos válidos geram recebíveis automaticamente. Ao editar a contratação, apenas recebíveis pendentes são recalculados; pagamentos realizados permanecem preservados no histórico.

O módulo **Equipe** cadastra sócios, advogados, associados, estagiários, administrativos, correspondentes e prestadores. Em cada caso é possível definir responsáveis, tipo de atuação e percentual de participação. A projeção individual considera somente receitas realizadas e vinculadas ao caso; receitas de pacotes permanecem separadas.

Toda receita deve ser vinculada a um cliente e pode apontar para um pacote ou para um caso específico. Quando houver vínculo com um caso, o lançamento grava uma fotografia da equipe, dos percentuais e dos valores individuais naquele momento. Essa distribuição histórica não muda se a composição futura do caso for alterada. Despesas gerais do escritório podem permanecer sem cliente; despesas relacionadas devem ser vinculadas ao cliente, pacote ou caso correspondente.

Backups no formato atual continuam aceitos. Campos contratuais que não existirem no arquivo permanecem em branco; valores de estruturas anteriores não são convertidos implicitamente.

Os dados ficam no navegador e podem ser sincronizados com um Gist privado em **Configurações**. Antes de enviar, o sistema lê o conteúdo atual do Gist e mescla inclusões, edições e exclusões por registro, evitando que um navegador com dados antigos apague alterações feitas em outro computador. O token do GitHub nunca é gravado no repositório: permanece apenas no `localStorage` do navegador.

O sistema inicia completamente vazio, sem clientes, casos, equipe, configurações ou lançamentos demonstrativos. Dados existentes devem ser recuperados exclusivamente após configurar e mesclar o Gist de forma consciente.

Não há compilação do código da aplicação. O workflow do OfficeJur publica este módulo em `/officejur/financeiro/`.

## Mercado Pago

O módulo **Cobranças** gera links do Checkout Pro vinculados aos recebíveis. Por segurança, a credencial privada não é armazenada na página estática.

Para configurar a integração sem terminal, abra a central de ajuda:

**[Ajuda de configuração do Mercado Pago](ajuda-mercado-pago.html)**

O código do serviço protegido permanece em `worker/src/index.js`.

## Referências externas

As bibliotecas, plataformas, APIs e serviços externos usados pelo projeto estão
documentados em **[Referências externas](REFERENCIAS-EXTERNAS.md)**, com suas
finalidades, origens e licenças aplicáveis.
