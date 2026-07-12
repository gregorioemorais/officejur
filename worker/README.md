# Serviço seguro do Mercado Pago

Este Worker cria preferências do Checkout Pro sem enviar o `Access Token` ao navegador.

Para configuração completa sem terminal, consulte [`../TUTORIAL-MERCADO-PAGO.md`](../TUTORIAL-MERCADO-PAGO.md).

## Configuração pelo terminal — opcional

1. Instale/autentique o Wrangler: `npx wrangler login`.
2. Ajuste `ALLOWED_ORIGINS` no `wrangler.toml` para a origem exata do GitHub Pages.
3. Cadastre o segredo: `npx wrangler secret put MP_ACCESS_TOKEN`.
4. Publique: `npx wrangler deploy`.
5. No sistema, abra **Cobranças → Configurar conta** e informe a URL publicada.

Opcionalmente, configure `MP_WEBHOOK_URL` como segredo. A confirmação manual pelo botão de atualizar já consulta os pagamentos pelo `external_reference`.

Nunca coloque o Access Token no `wrangler.toml`, no JavaScript do site ou no Gist.
