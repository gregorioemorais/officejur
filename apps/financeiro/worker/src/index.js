const MP_API = 'https://api.mercadopago.com';

function cors(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean);
  const value = allowed.includes(origin) ? origin : allowed[0] || origin;
  return { 'Access-Control-Allow-Origin': value, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers } });
}

async function mercadoPago(path, env, options = {}) {
  const response = await fetch(`${MP_API}${path}`, { ...options, headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`, 'Content-Type': 'application/json', 'X-Idempotency-Key': options.idempotencyKey || crypto.randomUUID() } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || body.error || `Mercado Pago respondeu ${response.status}`);
  return body;
}

function cleanText(value, max = 200) {
  return String(value || '').trim().slice(0, max);
}

export default {
  async fetch(request, env) {
    const headers = cors(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (!env.MP_ACCESS_TOKEN) return json({ message: 'MP_ACCESS_TOKEN não configurado no serviço.' }, 503, headers);
    const url = new URL(request.url);
    try {
      if (request.method === 'GET' && url.pathname === '/health') return json({ ok: true }, 200, headers);
      if (request.method === 'POST' && url.pathname === '/preferences') {
        const input = await request.json();
        const amount = Number(input.amount);
        if (!Number.isFinite(amount) || amount <= 0) return json({ message: 'Valor inválido.' }, 400, headers);
        if (!cleanText(input.externalReference, 100)) return json({ message: 'Referência externa obrigatória.' }, 400, headers);
        const base = cleanText(input.returnUrl, 500);
        const expires = /^\d{4}-\d{2}-\d{2}$/.test(input.expiresAt || '') ? `${input.expiresAt}T23:59:59.000-03:00` : null;
        const preference = {
          items: [{ id: cleanText(input.entryId, 100), title: cleanText(input.description, 120), quantity: 1, currency_id: 'BRL', unit_price: amount }],
          external_reference: cleanText(input.externalReference, 100),
          payer: { name: cleanText(input.payer?.name, 100), email: cleanText(input.payer?.email, 150) || undefined },
          back_urls: base ? { success: `${base}#charges`, pending: `${base}#charges`, failure: `${base}#charges` } : undefined,
          auto_return: input.autoReturn && base ? 'approved' : undefined,
          notification_url: env.MP_WEBHOOK_URL || undefined,
          statement_descriptor: cleanText(input.statementDescriptor, 22) || undefined,
          expires: Boolean(expires), date_of_expiration: expires || undefined,
          metadata: { finance_entry_id: cleanText(input.entryId, 100), client_id: cleanText(input.clientId, 100) }
        };
        const result = await mercadoPago('/checkout/preferences', env, { method: 'POST', body: JSON.stringify(preference) });
        return json({ preferenceId: result.id, checkoutUrl: result.init_point, sandboxUrl: result.sandbox_init_point }, 201, headers);
      }
      const match = url.pathname.match(/^\/preferences\/([^/]+)$/);
      if (request.method === 'GET' && match) {
        const preferenceId = decodeURIComponent(match[1]);
        await mercadoPago(`/checkout/preferences/${encodeURIComponent(preferenceId)}`, env);
        const reference = cleanText(url.searchParams.get('external_reference'), 100);
        const search = reference ? await mercadoPago(`/v1/payments/search?external_reference=${encodeURIComponent(reference)}&sort=date_created&criteria=desc`, env) : { results: [] };
        const payment = search.results?.[0];
        return json({ status: payment?.status || 'pending', paymentId: payment?.id || '', paidDate: payment?.date_approved || '' }, 200, headers);
      }
      return json({ message: 'Rota não encontrada.' }, 404, headers);
    } catch (error) {
      return json({ message: error.message || 'Erro inesperado.' }, 502, headers);
    }
  }
};
