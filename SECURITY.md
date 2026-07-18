# 🔐 Política de segurança do OfficeJur

## 🛡️ Versões com suporte

Enquanto não houver uma política formal de releases, somente o estado atual da
branch `main` recebe correções de segurança.

| Versão | Suporte |
| --- | --- |
| `main` atual | ✅ Sim |
| commits e versões anteriores | ❌ Não garantido |
| forks e modificações de terceiros | ❌ Responsabilidade do respectivo operador |

## 🚨 Como relatar uma vulnerabilidade

Não publique vulnerabilidades, provas de conceito, credenciais ou dados reais
em issues, discussões ou pull requests.

O recurso privado **Report a vulnerability** é o canal preferencial:

https://github.com/gregorioemorais/officejur/security/advisories/new

> ⚙️ Em 17 de julho de 2026, o recurso ainda não estava habilitado no
> repositório. Até sua ativação, abra uma issue contendo **somente** um pedido de
> canal privado, sem descrever a vulnerabilidade, dados, credenciais ou passos de
> reprodução. O mantenedor deverá fornecer um meio reservado antes do envio dos
> detalhes.

Inclua, quando possível:

- módulo e arquivo afetado;
- impacto observado ou potencial;
- passos mínimos para reprodução;
- ambiente e navegador utilizados;
- proposta de correção, se houver; e
- forma segura de contato.

## ⏱️ Tratamento esperado

O projeto procurará:

1. confirmar o recebimento;
2. avaliar impacto e reprodutibilidade;
3. preparar e validar uma correção;
4. coordenar a divulgação responsável; e
5. creditar o pesquisador, se desejado e apropriado.

Não são prometidos prazos fixos de resposta ou correção. Casos que envolvam
dependências, serviços externos ou ausência de informações podem exigir mais
tempo.

## ✅ Pesquisa de boa-fé

Durante o período restrito da licença, testes de segurança são permitidos quando:

- ocorrem em ambiente próprio ou expressamente autorizado;
- não acessam dados de terceiros;
- evitam indisponibilidade, destruição ou alteração de dados;
- não utilizam engenharia social, fraude ou credenciais obtidas indevidamente;
- coletam apenas o necessário para demonstrar o problema; e
- seguem divulgação responsável.

Essa permissão não autoriza testes contra instalações de terceiros nem Uso em
Produção do OfficeJur.

## 🧾 Dados sensíveis

Remova nomes, números de processos, documentos pessoais, tokens e segredos antes
de enviar qualquer evidência. Caso um segredo seja exposto, revogue-o
imediatamente; removê-lo do texto não elimina sua presença no histórico.
