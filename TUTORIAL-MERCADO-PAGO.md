# Tutorial: configurar cobranças pelo Mercado Pago

Este documento explica como colocar o módulo de cobranças em funcionamento sem utilizar terminal, `npm` ou `npx`.

## Por que é necessário um serviço separado?

O sistema financeiro é publicado no GitHub Pages. O GitHub Pages entrega apenas HTML, CSS e JavaScript e não consegue executar código privado no servidor.

O Mercado Pago exige um `Access Token` para criar cobranças. Esse token funciona como uma senha e não pode aparecer no GitHub, no JavaScript do site, no Gist ou nas configurações visíveis do navegador.

Por isso, a integração funciona desta forma:

```text
Sistema no GitHub Pages
        ↓
Worker protegido da Cloudflare
        ↓
API do Mercado Pago
```

O sistema envia os dados da cobrança ao Worker. O Worker acrescenta o Access Token protegido e comunica-se com o Mercado Pago.

## O que será necessário

- Uma conta de vendedor no Mercado Pago.
- Uma aplicação criada no painel Mercado Pago Developers.
- Uma conta gratuita na Cloudflare.
- O endereço publicado do sistema no GitHub Pages.

## Parte 1 — Criar a aplicação no Mercado Pago

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel/app).
2. Entre com a conta do Mercado Pago que receberá os honorários.
3. Clique em **Criar aplicação**.
4. Informe um nome, por exemplo `Financeiro Gregório e Morais`.
5. Selecione **Pagamentos online** ou **Checkouts**.
6. Selecione **Checkout Pro** como solução.
7. Conclua a criação da aplicação.

Na aplicação serão disponibilizadas credenciais de teste e de produção:

- **Public Key:** pode ser cadastrada no painel do sistema.
- **Access Token:** é privado e será cadastrado somente na Cloudflare.

Comece pelas credenciais de teste. Troque para produção somente depois de validar o fluxo completo.

## Parte 2 — Criar o Worker pela interface da Cloudflare

Os nomes dos menus da Cloudflare podem mudar ligeiramente, mas normalmente o fluxo é o seguinte:

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Crie uma conta ou entre em uma conta existente.
3. No menu, acesse **Workers & Pages**.
4. Clique em **Create**, **Create application** ou **Criar**.
5. Escolha **Worker** ou **Start with Hello World**.
6. Defina o nome `financeiro-mercado-pago`.
7. Clique em **Deploy** para criar o Worker inicial.
8. Abra o Worker recém-criado.
9. Clique em **Edit code**, **Quick edit** ou **Editar código**.
10. Apague o código de exemplo.
11. Abra o arquivo [`worker/src/index.js`](worker/src/index.js) deste repositório.
12. Copie todo o conteúdo desse arquivo e cole no editor da Cloudflare.
13. Clique em **Save and deploy**.

Ao final, a Cloudflare fornecerá um endereço semelhante a:

```text
https://financeiro-mercado-pago.NOME-DA-CONTA.workers.dev
```

Guarde esse endereço. Ele será informado no sistema financeiro.

## Parte 3 — Cadastrar as variáveis e o segredo

1. Dentro do Worker, abra **Settings**.
2. Procure **Variables and Secrets**, **Environment Variables** ou opção semelhante.
3. Adicione as variáveis abaixo.

### `ALLOWED_ORIGINS`

Tipo: texto normal, não precisa ser segredo.

Valor: a origem exata do GitHub Pages, sem caminho e sem barra no final.

Exemplo:

```text
https://gregorioemorais.github.io
```

Se houver mais de uma origem autorizada, separe por vírgula:

```text
https://gregorioemorais.github.io,https://financeiro.exemplo.com.br
```

### `MP_ACCESS_TOKEN`

Tipo: **Secret**, **Encrypt** ou **Segredo**.

Valor: o Access Token copiado do painel Mercado Pago Developers.

Nunca cadastre o Access Token como variável pública. Depois de salvo, a Cloudflare deve ocultar seu conteúdo.

### `MP_WEBHOOK_URL` — opcional

Esta variável é reservada para uma futura confirmação automática por webhook. Ela não é necessária para gerar links nem para consultar manualmente os pagamentos.

Depois de cadastrar as variáveis, publique novamente o Worker se a Cloudflare solicitar.

## Parte 4 — Testar o Worker

Abra no navegador o endereço do Worker acrescentando `/health`:

```text
https://financeiro-mercado-pago.NOME-DA-CONTA.workers.dev/health
```

Com o `MP_ACCESS_TOKEN` configurado, a resposta esperada é:

```json
{"ok":true}
```

Se aparecer `MP_ACCESS_TOKEN não configurado no serviço`, volte às variáveis do Worker e confira o nome do segredo.

## Parte 5 — Configurar o sistema financeiro

1. Abra o sistema financeiro publicado no GitHub Pages.
2. Acesse **Cobranças**.
3. Clique em **Configurar conta**.
4. Preencha os campos:

   - **Ambiente:** escolha `Testes` inicialmente.
   - **Public Key:** copie a Public Key correspondente ao ambiente.
   - **URL do serviço seguro:** cole a URL do Worker, sem `/health`.
   - **URL de retorno:** informe o endereço completo do sistema financeiro.
   - **Identificação no extrato:** use um nome reconhecível, com até 22 caracteres.
   - **Retorno automático:** pode permanecer ativado.

5. Clique em **Salvar configuração**.

Não existe campo de Access Token no sistema. Isso é intencional: o token deve permanecer exclusivamente na Cloudflare.

## Parte 6 — Gerar a primeira cobrança de teste

1. Cadastre um cliente com nome e e-mail.
2. Crie um lançamento do tipo **Receita** e deixe o status como **Pendente**.
3. Acesse **Cobranças**.
4. Clique em **Gerar cobrança**.
5. Selecione o lançamento pendente.
6. Confira valor, vencimento, descrição e dados do pagador.
7. Clique em **Criar link de pagamento**.
8. Use o botão de copiar ou abrir para acessar o Checkout Pro.

No ambiente de testes, utilize os usuários e cartões de teste fornecidos pelo próprio Mercado Pago. Não use cartão real com credenciais de teste.

Depois do pagamento, clique no ícone de atualização da cobrança. Quando o Mercado Pago responder `approved`, o sistema marcará a cobrança como aprovada e o lançamento financeiro como realizado.

## Parte 7 — Ativar pagamentos reais

Somente faça esta troca depois que o fluxo de testes funcionar:

1. Ative as credenciais de produção no Mercado Pago Developers.
2. Copie o Access Token de produção.
3. Na Cloudflare, substitua o segredo `MP_ACCESS_TOKEN` pelo token de produção.
4. Publique novamente o Worker, se solicitado.
5. No sistema, abra **Cobranças → Configurar conta**.
6. Mude o ambiente para **Produção**.
7. Substitua a Public Key pela credencial de produção.
8. Salve e gere uma cobrança real de pequeno valor para validação.

Não misture Public Key de teste, Access Token de produção ou vice-versa.

## Erros comuns

### “Failed to fetch” ou erro de CORS

- Confira `ALLOWED_ORIGINS` na Cloudflare.
- Informe somente a origem, como `https://usuario.github.io`.
- Não inclua o caminho do repositório em `ALLOWED_ORIGINS`.
- Verifique se a URL do Worker foi copiada corretamente.

### “MP_ACCESS_TOKEN não configurado”

- O segredo deve ter exatamente o nome `MP_ACCESS_TOKEN`.
- Confirme que ele foi adicionado ao mesmo ambiente do Worker publicado.

### “Unauthorized” ou erro 401

- O token pode estar incorreto, expirado ou pertencer a outra aplicação.
- Confira se o ambiente selecionado no sistema corresponde à credencial utilizada.
- Se a credencial tiver sido renovada, atualize o segredo da Cloudflare.

### A cobrança foi paga, mas continua aguardando

- Clique no botão de atualizar status na tabela de cobranças.
- Confirme que a cobrança foi paga no mesmo ambiente em que foi criada.
- Confira se o lançamento possui a mesma referência externa apresentada no Mercado Pago.

### O link abre o ambiente de testes

- No painel de configuração do sistema, altere o ambiente para produção.
- Confirme que o segredo da Cloudflare também contém o Access Token de produção.

## Atualizar o código do Worker no futuro

Quando o arquivo `worker/src/index.js` for alterado neste repositório:

1. Abra o Worker na Cloudflare.
2. Acesse **Edit code**.
3. Substitua o código existente pelo conteúdo atualizado do arquivo.
4. Clique em **Save and deploy**.

As variáveis e os segredos normalmente permanecem cadastrados após a atualização.

## Regras de segurança

- Nunca cole o Access Token em arquivos do GitHub.
- Nunca coloque o Access Token no Gist de dados.
- Nunca envie o token por WhatsApp, e-mail ou captura de tela.
- Sempre cadastre o token como segredo criptografado na Cloudflare.
- Renove imediatamente a credencial caso ela seja exposta.
- Faça os primeiros testes com credenciais e usuários de teste.
- Restrinja `ALLOWED_ORIGINS` ao endereço real do sistema.

## Referências oficiais

- [Referência da API do Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference)
- [Credenciais](https://www.mercadopago.com.br/developers/pt/docs/credentials)
- [Visão geral do Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/overview)
- [Criar uma preferência de pagamento](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/create-payment-preference)
