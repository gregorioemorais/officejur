(function () {
  'use strict';

  const STORAGE_KEY = 'gm-payments-data-v1';
  const SETTINGS_KEY = 'gm-payments-gist-settings-v1';
  const FILE_NAME = 'controle-pagamentos.json';
  const SCHEMA = 'gm-payments-v1';
  const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const COLORS = ['#b38731', '#17213a', '#667085', '#d9bd7a', '#067647', '#9e3b2f', '#46627f', '#8c6f2f'];

  const state = {
    data: loadData(),
    settings: loadSettings(),
    selectedId: '',
    year: new Date().getFullYear(),
    tab: 'launches',
    editingPaymentId: '',
    activeMonth: ''
  };

  const $ = (selector) => document.querySelector(selector);

  const els = {
    storageStatus: $('#storage-status'),
    personForm: $('#person-form'),
    personName: $('#person-name'),
    search: $('#search'),
    peopleList: $('#people-list'),
    emptyState: $('#empty-state'),
    personView: $('#person-view'),
    selectedName: $('#selected-name'),
    personSummary: $('#person-summary'),
    deletePerson: $('#delete-person'),
    tabs: document.querySelectorAll('.tabs button'),
    launchesTab: $('#launches-tab'),
    statsTab: $('#stats-tab'),
    paymentForm: $('#payment-form'),
    paymentMonth: $('#payment-month'),
    paymentAmount: $('#payment-amount'),
    paymentDate: $('#payment-date'),
    paymentNote: $('#payment-note'),
    paymentSubmit: $('#payment-submit'),
    cancelEdit: $('#cancel-edit'),
    previousYear: $('#previous-year'),
    nextYear: $('#next-year'),
    yearLabel: $('#year-label'),
    monthGrid: $('#month-grid'),
    metricTotal: $('#metric-total'),
    metricPaid: $('#metric-paid'),
    metricAverage: $('#metric-average'),
    metricLast: $('#metric-last'),
    pieChart: $('#pie-chart'),
    pieLegend: $('#pie-legend'),
    pieCaption: $('#pie-caption'),
    barChart: $('#bar-chart'),
    syncNow: $('#sync-now'),
    openSettings: $('#open-settings'),
    settingsModal: $('#settings-modal'),
    closeSettings: $('#close-settings'),
    gistId: $('#gist-id'),
    gistFile: $('#gist-file'),
    gistToken: $('#gist-token'),
    autoSync: $('#auto-sync'),
    saveSettings: $('#save-settings'),
    createGist: $('#create-gist'),
    pullGist: $('#pull-gist'),
    pushGist: $('#push-gist'),
    settingsStatus: $('#settings-status'),
    paymentsModal: $('#payments-modal'),
    paymentsTitle: $('#payments-title'),
    paymentsSubtitle: $('#payments-subtitle'),
    paymentsList: $('#payments-list'),
    closePayments: $('#close-payments'),
    addPaymentFromModal: $('#add-payment-from-modal')
  };

  function uid() {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function currentMonthISO() {
    return new Date().toISOString().slice(0, 7);
  }

  function money(value) {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function parseMoney(raw) {
    const normalized = String(raw || '')
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    const value = Number(normalized);
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  function formatDate(value) {
    if (!value) return 'Sem data';
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return value;
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
  }

  function normalizePayment(payment) {
    const src = payment && typeof payment === 'object' ? payment : {};
    const month = /^\d{4}-\d{2}$/.test(src.month || '') ? src.month : currentMonthISO();
    return {
      id: src.id ? String(src.id) : uid(),
      month,
      amount: Number.isFinite(Number(src.amount)) ? Number(src.amount) : 0,
      paidAt: /^\d{4}-\d{2}-\d{2}$/.test(src.paidAt || '') ? src.paidAt : todayISO(),
      note: String(src.note || '').trim(),
      createdAt: src.createdAt || new Date().toISOString()
    };
  }

  function normalizePerson(person) {
    const src = person && typeof person === 'object' ? person : {};
    return {
      id: src.id ? String(src.id) : uid(),
      name: String(src.name || '').trim() || 'Sem nome',
      payments: Array.isArray(src.payments) ? src.payments.map(normalizePayment) : [],
      createdAt: src.createdAt || new Date().toISOString()
    };
  }

  function normalizeData(data) {
    const src = data && typeof data === 'object' ? data : {};
    return {
      schema: SCHEMA,
      updatedAt: src.updatedAt || new Date().toISOString(),
      people: Array.isArray(src.people) ? src.people.map(normalizePerson) : []
    };
  }

  function loadData() {
    try {
      return normalizeData(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch (_) {
      return normalizeData({});
    }
  }

  function loadSettings() {
    try {
      return normalizeSettings(JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'));
    } catch (_) {
      return normalizeSettings({});
    }
  }

  function normalizeSettings(settings) {
    const src = settings && typeof settings === 'object' ? settings : {};
    return {
      gistId: String(src.gistId || '').trim(),
      token: String(src.token || '').trim(),
      fileName: String(src.fileName || FILE_NAME).trim() || FILE_NAME,
      autoSync: !!src.autoSync,
      lastSyncAt: String(src.lastSyncAt || '').trim()
    };
  }

  function saveSettings() {
    state.settings = normalizeSettings(state.settings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
    renderStatus();
  }

  function persist(options) {
    state.data.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    render();
    if (options && options.skipAutoSync) return;
    if (state.settings.autoSync && state.settings.gistId && state.settings.token) {
      pushToGist().catch((error) => renderStatus(error.message, 'err'));
    }
  }

  function selectedPerson() {
    return state.data.people.find((person) => person.id === state.selectedId) || null;
  }

  function paymentTotals(person) {
    const payments = person ? person.payments : [];
    const total = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const months = new Set(payments.map((payment) => payment.month));
    const last = payments.slice().sort((a, b) => String(b.paidAt).localeCompare(String(a.paidAt)))[0];
    return { total, paidMonths: months.size, average: months.size ? total / months.size : 0, last };
  }

  function renderStatus(message, tone) {
    const settings = state.settings;
    if (message) {
      els.storageStatus.textContent = message;
      els.storageStatus.style.color = tone === 'err' ? 'var(--danger)' : tone === 'ok' ? 'var(--ok)' : '';
      return;
    }
    const mode = settings.gistId ? 'Gist configurado' : 'Salvo neste navegador';
    const last = settings.lastSyncAt ? ` - última sincronização: ${new Date(settings.lastSyncAt).toLocaleString('pt-BR')}` : '';
    els.storageStatus.textContent = `${mode}${last}.`;
    els.storageStatus.style.color = '';
  }

  function renderPeople() {
    const query = els.search.value.trim().toLowerCase();
    const people = state.data.people
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .filter((person) => person.name.toLowerCase().includes(query));
    els.peopleList.innerHTML = '';
    people.forEach((person) => {
      const totals = paymentTotals(person);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `person-item${person.id === state.selectedId ? ' is-active' : ''}`;
      button.innerHTML = `<strong>${escapeHtml(person.name)}</strong><span>${totals.paidMonths} mês(es) - ${money(totals.total)}</span>`;
      button.addEventListener('click', () => {
        state.selectedId = person.id;
        render();
      });
      els.peopleList.appendChild(button);
    });
  }

  function renderPerson() {
    const person = selectedPerson();
    els.emptyState.hidden = !!person;
    els.personView.hidden = !person;
    if (!person) return;
    const totals = paymentTotals(person);
    els.selectedName.value = person.name;
    els.personSummary.textContent = `${totals.paidMonths} mês(es) pagos - ${money(totals.total)} recebidos`;
    els.launchesTab.hidden = state.tab !== 'launches';
    els.statsTab.hidden = state.tab !== 'stats';
    els.tabs.forEach((button) => button.classList.toggle('is-active', button.dataset.tab === state.tab));
    renderMonths(person);
    renderStats(person);
  }

  function renderMonths(person) {
    els.yearLabel.textContent = state.year;
    els.monthGrid.innerHTML = '';
    MONTHS.forEach((label, index) => {
      const monthKey = `${state.year}-${String(index + 1).padStart(2, '0')}`;
      const payments = person.payments.filter((payment) => payment.month === monthKey);
      const total = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      const last = payments.slice().sort((a, b) => String(b.paidAt).localeCompare(String(a.paidAt)))[0];
      const card = document.createElement('article');
      card.className = 'month-card';
      card.innerHTML = `
        <header>
          <h3>${label}</h3>
          <span class="badge ${payments.length ? 'paid' : ''}">${payments.length ? 'Pago' : 'Aberto'}</span>
        </header>
        <div class="value">${money(total)}</div>
        <p>${last ? `${formatDate(last.paidAt)}${last.note ? ` - ${escapeHtml(last.note)}` : ''}` : 'Sem lançamento para este mês.'}</p>
        <div class="month-actions">
          <button class="button ghost" type="button" data-add="${monthKey}">Lançar</button>
          <button class="button ghost" type="button" data-list="${monthKey}" ${payments.length ? '' : 'disabled'}>Ver lançamentos</button>
        </div>
      `;
      card.querySelector('[data-add]').addEventListener('click', () => {
        els.paymentMonth.value = monthKey;
        els.paymentAmount.focus();
      });
      card.querySelector('[data-list]').addEventListener('click', () => openPaymentsModal(monthKey));
      els.monthGrid.appendChild(card);
    });
  }

  function renderPaymentList(payments, monthKey) {
    if (!payments.length) {
      return '<div class="empty-payments">Nenhum lançamento registrado neste mês.</div>';
    }
    const ordered = payments.slice().sort((a, b) => String(a.paidAt).localeCompare(String(b.paidAt)));
    return `
      <div class="payment-list" data-month="${escapeHtml(monthKey)}">
        ${ordered.map((payment) => `
          <div class="payment-row">
            <div>
              <strong>${money(payment.amount)}</strong>
              <span>${formatDate(payment.paidAt)}${payment.note ? ` - ${escapeHtml(payment.note)}` : ''}</span>
            </div>
            <div class="payment-row-actions">
              <button class="mini-button" type="button" data-edit-payment="${escapeHtml(payment.id)}">Editar</button>
              <button class="mini-button danger" type="button" data-delete-payment="${escapeHtml(payment.id)}">Excluir</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function monthTitle(monthKey) {
    const [year, month] = String(monthKey || '').split('-');
    const label = MONTHS[Number(month) - 1] || monthKey;
    return `${label} de ${year}`;
  }

  function openPaymentsModal(monthKey) {
    state.activeMonth = monthKey;
    renderPaymentsModal();
    els.paymentsModal.hidden = false;
  }

  function closePaymentsModal() {
    els.paymentsModal.hidden = true;
    state.activeMonth = '';
  }

  function renderPaymentsModal() {
    const person = selectedPerson();
    if (!person || !state.activeMonth) return;
    const payments = person.payments.filter((payment) => payment.month === state.activeMonth);
    const total = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    els.paymentsTitle.textContent = `Lançamentos de ${monthTitle(state.activeMonth)}`;
    els.paymentsSubtitle.textContent = `${person.name} - ${payments.length} lançamento(s) - ${money(total)}`;
    els.paymentsList.innerHTML = renderPaymentList(payments, state.activeMonth);
    els.paymentsList.querySelectorAll('[data-edit-payment]').forEach((button) => {
      button.addEventListener('click', () => editPayment(button.dataset.editPayment));
    });
    els.paymentsList.querySelectorAll('[data-delete-payment]').forEach((button) => {
      button.addEventListener('click', () => deletePayment(button.dataset.deletePayment));
    });
  }

  function renderStats(person) {
    const totals = paymentTotals(person);
    els.metricTotal.textContent = money(totals.total);
    els.metricPaid.textContent = String(totals.paidMonths);
    els.metricAverage.textContent = money(totals.average);
    els.metricLast.textContent = totals.last ? formatDate(totals.last.paidAt) : '-';
    renderPie(person);
    renderBars(person);
  }

  function renderPie(person) {
    const byYear = new Map();
    person.payments.forEach((payment) => {
      const year = payment.month.slice(0, 4);
      byYear.set(year, (byYear.get(year) || 0) + Number(payment.amount || 0));
    });
    const entries = Array.from(byYear.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const total = entries.reduce((sum, item) => sum + item[1], 0);
    els.pieLegend.innerHTML = '';
    if (!total) {
      els.pieChart.style.background = '#eef1f5';
      els.pieCaption.textContent = 'sem dados';
      return;
    }
    let cursor = 0;
    const stops = entries.map(([year, value], index) => {
      const start = cursor;
      const end = cursor + (value / total) * 100;
      cursor = end;
      return `${COLORS[index % COLORS.length]} ${start}% ${end}%`;
    });
    els.pieChart.style.background = `conic-gradient(${stops.join(', ')})`;
    els.pieCaption.textContent = money(total);
    entries.forEach(([year, value], index) => {
      const row = document.createElement('div');
      row.className = 'legend-item';
      row.innerHTML = `<span class="legend-color" style="background:${COLORS[index % COLORS.length]}"></span><span>${year}</span><strong>${money(value)}</strong>`;
      els.pieLegend.appendChild(row);
    });
  }

  function renderBars(person) {
    const months = [];
    const start = new Date(state.year, new Date().getMonth() - 11, 1);
    for (let i = 0; i < 12; i += 1) {
      const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
      months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    }
    const values = months.map((month) => person.payments
      .filter((payment) => payment.month === month)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0));
    const max = Math.max(...values, 1);
    els.barChart.innerHTML = '';
    months.forEach((month, index) => {
      const [year, monthNumber] = month.split('-');
      const item = document.createElement('div');
      item.className = 'bar-item';
      item.title = `${month}/${year}: ${money(values[index])}`;
      item.innerHTML = `<div class="bar" style="height:${Math.max(3, (values[index] / max) * 220)}px"></div><span>${MONTHS[Number(monthNumber) - 1]}</span>`;
      els.barChart.appendChild(item);
    });
  }

  function renderSettingsForm() {
    els.gistId.value = state.settings.gistId;
    els.gistFile.value = state.settings.fileName;
    els.gistToken.value = state.settings.token;
    els.autoSync.checked = state.settings.autoSync;
  }

  function render() {
    renderStatus();
    renderPeople();
    renderPerson();
  }

  function addPerson(name) {
    const person = normalizePerson({ name, payments: [] });
    state.data.people.push(person);
    state.selectedId = person.id;
    persist();
  }

  function resetPaymentForm(month) {
    state.editingPaymentId = '';
    els.paymentForm.reset();
    els.paymentMonth.value = month || currentMonthISO();
    els.paymentDate.value = todayISO();
    els.paymentSubmit.textContent = 'Lançar pagamento';
    els.cancelEdit.hidden = true;
  }

  function deleteSelectedPerson() {
    const person = selectedPerson();
    if (!person) return;
    if (!confirm(`Excluir ${person.name} e todos os lançamentos?`)) return;
    state.data.people = state.data.people.filter((item) => item.id !== person.id);
    state.selectedId = state.data.people[0] ? state.data.people[0].id : '';
    persist();
  }

  function upsertPayment(event) {
    event.preventDefault();
    const person = selectedPerson();
    if (!person) return;
    const payment = normalizePayment({
      id: state.editingPaymentId || uid(),
      month: els.paymentMonth.value,
      amount: parseMoney(els.paymentAmount.value),
      paidAt: els.paymentDate.value || todayISO(),
      note: els.paymentNote.value,
      createdAt: new Date().toISOString()
    });
    if (!payment.amount) {
      els.paymentAmount.focus();
      return;
    }
    const existingIndex = person.payments.findIndex((item) => item.id === state.editingPaymentId);
    if (existingIndex >= 0) {
      payment.createdAt = person.payments[existingIndex].createdAt || payment.createdAt;
      person.payments.splice(existingIndex, 1, payment);
    } else {
      person.payments.push(payment);
    }
    state.year = Number(payment.month.slice(0, 4));
    resetPaymentForm(payment.month);
    persist();
  }

  function editPayment(paymentId) {
    const person = selectedPerson();
    if (!person) return;
    const payment = person.payments.find((item) => item.id === paymentId);
    if (!payment) return;
    state.editingPaymentId = payment.id;
    els.paymentMonth.value = payment.month;
    els.paymentAmount.value = String(payment.amount).replace('.', ',');
    els.paymentDate.value = payment.paidAt;
    els.paymentNote.value = payment.note || '';
    els.paymentSubmit.textContent = 'Salvar edição';
    els.cancelEdit.hidden = false;
    closePaymentsModal();
    els.paymentAmount.focus();
  }

  function deletePayment(paymentId) {
    const person = selectedPerson();
    if (!person) return;
    const payment = person.payments.find((item) => item.id === paymentId);
    if (!payment) return;
    if (!confirm(`Excluir o lançamento de ${money(payment.amount)} em ${formatDate(payment.paidAt)}?`)) return;
    person.payments = person.payments.filter((item) => item.id !== paymentId);
    if (state.editingPaymentId === paymentId) resetPaymentForm(payment.month);
    persist();
    if (!els.paymentsModal.hidden) {
      state.activeMonth = payment.month;
      renderPaymentsModal();
    }
  }

  function clearMonth(monthKey) {
    const person = selectedPerson();
    if (!person) return;
    if (!confirm(`Remover lançamentos de ${monthKey}?`)) return;
    person.payments = person.payments.filter((payment) => payment.month !== monthKey);
    persist();
  }

  function readSettingsForm() {
    state.settings = normalizeSettings({
      gistId: els.gistId.value,
      fileName: els.gistFile.value,
      token: els.gistToken.value,
      autoSync: els.autoSync.checked,
      lastSyncAt: state.settings.lastSyncAt
    });
    saveSettings();
  }

  async function githubRequest(path, options) {
    const response = await fetch(`https://api.github.com${path}`, {
      method: options.method || 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.settings.token}`
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    if (!response.ok) {
      let message = `GitHub respondeu com status ${response.status}.`;
      try {
        const parsed = await response.json();
        if (parsed && parsed.message) message = parsed.message;
      } catch (_) {}
      throw new Error(message);
    }
    return response.json();
  }

  async function fetchGistFile() {
    if (!state.settings.gistId) throw new Error('Informe o Gist ID.');
    if (!state.settings.token) throw new Error('Informe o token do GitHub.');
    const gist = await githubRequest(`/gists/${encodeURIComponent(state.settings.gistId)}`, { method: 'GET' });
    const file = gist.files ? gist.files[state.settings.fileName] : null;
    return { gist, file };
  }

  function gistPayload() {
    return {
      schema: SCHEMA,
      exportedAt: new Date().toISOString(),
      data: normalizeData(state.data)
    };
  }

  async function createGist() {
    readSettingsForm();
    if (!state.settings.token) throw new Error('Informe o token do GitHub.');
    if (state.settings.gistId) {
      const { file } = await fetchGistFile();
      if (file && file.content) {
        const shouldRead = confirm(`Já existe um arquivo "${state.settings.fileName}" neste Gist. Clique em OK para carregar o arquivo existente. Clique em Cancelar para decidir se quer sobrescrever.`);
        if (shouldRead) {
          await applyGistFile(file);
          setSettingsStatus('Arquivo existente carregado do Gist.', 'ok');
          return;
        }
        const shouldOverwrite = confirm('Começar do zero vai sobrescrever o arquivo existente no Gist. Deseja continuar?');
        if (!shouldOverwrite) {
          setSettingsStatus('Nenhuma alteração enviada ao Gist.', '');
          return;
        }
        await pushToGist();
        return;
      }
      await pushToGist();
      return;
    }
    const gist = await githubRequest('/gists', {
      method: 'POST',
      body: {
        description: 'Controle de Pagamentos - Gregório & Morais Advogados',
        public: false,
        files: {
          [state.settings.fileName]: {
            content: JSON.stringify(gistPayload(), null, 2)
          }
        }
      }
    });
    state.settings.gistId = gist.id || '';
    state.settings.lastSyncAt = new Date().toISOString();
    saveSettings();
    renderSettingsForm();
    setSettingsStatus('Gist criado e dados enviados.', 'ok');
  }

  async function pushToGist() {
    if (!state.settings.gistId) throw new Error('Informe o Gist ID ou crie um Gist.');
    if (!state.settings.token) throw new Error('Informe o token do GitHub.');
    await githubRequest(`/gists/${encodeURIComponent(state.settings.gistId)}`, {
      method: 'PATCH',
      body: {
        files: {
          [state.settings.fileName]: {
            content: JSON.stringify(gistPayload(), null, 2)
          }
        }
      }
    });
    state.settings.lastSyncAt = new Date().toISOString();
    saveSettings();
    setSettingsStatus('Dados enviados ao Gist.', 'ok');
  }

  async function pullFromGist() {
    if (!state.settings.gistId) throw new Error('Informe o Gist ID.');
    if (!state.settings.token) throw new Error('Informe o token do GitHub.');
    const { file } = await fetchGistFile();
    if (!file || !file.content) throw new Error('Arquivo não encontrado no Gist.');
    await applyGistFile(file);
    setSettingsStatus('Dados lidos do Gist.', 'ok');
  }

  async function applyGistFile(file) {
    const payload = JSON.parse(file.content);
    state.data = normalizeData(payload.data || payload);
    state.settings.lastSyncAt = new Date().toISOString();
    saveSettings();
    state.selectedId = state.data.people[0] ? state.data.people[0].id : '';
    persist({ skipAutoSync: true });
  }

  async function saveSettingsSafely() {
    readSettingsForm();
    if (!state.settings.gistId || !state.settings.token) {
      setSettingsStatus('Configurações salvas.', 'ok');
      return;
    }
    setSettingsStatus('Verificando arquivo no Gist...', '');
    const { file } = await fetchGistFile();
    if (file && file.content) {
      const shouldRead = confirm(`Já existe um arquivo "${state.settings.fileName}" neste Gist. Clique em OK para carregar os dados existentes. Clique em Cancelar para manter os dados locais sem enviar nada.`);
      if (shouldRead) {
        await applyGistFile(file);
        setSettingsStatus('Configurações salvas e arquivo existente carregado.', 'ok');
        return;
      }
      setSettingsStatus('Configurações salvas. Dados locais mantidos; nada foi enviado ao Gist.', 'ok');
      return;
    }
    setSettingsStatus('Configurações salvas. Arquivo ainda não existe neste Gist.', 'ok');
  }

  function setSettingsStatus(message, tone) {
    els.settingsStatus.textContent = message || '';
    els.settingsStatus.style.color = tone === 'err' ? 'var(--danger)' : tone === 'ok' ? 'var(--ok)' : '';
    renderStatus(message, tone);
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));
  }

  function bind() {
    els.personForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = els.personName.value.trim();
      if (!name) return;
      els.personName.value = '';
      addPerson(name);
    });
    els.search.addEventListener('input', renderPeople);
    els.selectedName.addEventListener('change', () => {
      const person = selectedPerson();
      if (!person) return;
      person.name = els.selectedName.value.trim() || person.name;
      persist();
    });
    els.deletePerson.addEventListener('click', deleteSelectedPerson);
    els.tabs.forEach((button) => button.addEventListener('click', () => {
      state.tab = button.dataset.tab;
      render();
    }));
    els.paymentForm.addEventListener('submit', upsertPayment);
    els.cancelEdit.addEventListener('click', () => resetPaymentForm(els.paymentMonth.value));
    els.previousYear.addEventListener('click', () => {
      state.year -= 1;
      renderPerson();
    });
    els.nextYear.addEventListener('click', () => {
      state.year += 1;
      renderPerson();
    });
    els.openSettings.addEventListener('click', () => {
      renderSettingsForm();
      els.settingsModal.hidden = false;
      els.gistId.focus();
    });
    els.closeSettings.addEventListener('click', () => {
      els.settingsModal.hidden = true;
    });
    els.settingsModal.addEventListener('click', (event) => {
      if (event.target === els.settingsModal) els.settingsModal.hidden = true;
    });
    els.closePayments.addEventListener('click', closePaymentsModal);
    els.paymentsModal.addEventListener('click', (event) => {
      if (event.target === els.paymentsModal) closePaymentsModal();
    });
    els.addPaymentFromModal.addEventListener('click', () => {
      const month = state.activeMonth || currentMonthISO();
      closePaymentsModal();
      resetPaymentForm(month);
      els.paymentAmount.focus();
    });
    els.saveSettings.addEventListener('click', () => {
      runGistAction(saveSettingsSafely, 'Salvando configurações...');
    });
    els.createGist.addEventListener('click', () => runGistAction(createGist, 'Criando Gist...'));
    els.pushGist.addEventListener('click', () => {
      readSettingsForm();
      runGistAction(pushToGist, 'Enviando dados...');
    });
    els.pullGist.addEventListener('click', () => {
      readSettingsForm();
      runGistAction(pullFromGist, 'Lendo Gist...');
    });
    els.syncNow.addEventListener('click', () => runGistAction(pushToGist, 'Sincronizando...'));
  }

  async function runGistAction(action, loadingMessage) {
    try {
      setSettingsStatus(loadingMessage, '');
      await action();
      render();
    } catch (error) {
      setSettingsStatus(error && error.message ? error.message : 'Falha ao acessar o Gist.', 'err');
    }
  }

  els.paymentMonth.value = currentMonthISO();
  els.paymentDate.value = todayISO();
  bind();
  state.selectedId = state.data.people[0] ? state.data.people[0].id : '';
  render();
})();
