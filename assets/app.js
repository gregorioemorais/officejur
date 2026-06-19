const STORAGE_KEY = 'gm-contrato-honorarios-draft-v1';
const form = document.getElementById('document-form');
const preview = document.getElementById('preview');
const loading = document.getElementById('preview-loading');
const pageCount = document.getElementById('page-count');
const clausesList = document.getElementById('clauses-list');
const clausesToggle = document.getElementById('clauses-toggle');
const clausesHint = document.getElementById('clauses-hint');
const parcelasField = document.getElementById('parcelas-field');

const GOLD = [179, 135, 49];
const GRAY = [88, 88, 92];
const FOOTER_GRAY = [125, 125, 128];
const MAPS_URL = 'https://maps.app.goo.gl/r8CVrczAXdqNZc6u9';
const LEFT = 19;
const WIDTH = 172;

const CONTRATADA_TEXT = 'Adauto Aparecido de Morais, inscrito na OAB/GO, sob o n.º 33.799; Jales Gregório de Oliveira Sousa, inscrito na OAB/GO, sob o n.º 62.131; e Matheus Ricardo de Sousa Ferreira, inscrito na OAB/GO, sob o n.º 60.162, todos integrantes do escritório Gregório & Morais, com endereço profissional indicado no rodapé deste instrumento.';

const DEFAULT_CLAUSES = [
  { id: 1, title: 'DO OBJETO', text: 'A CONTRATADA prestará os serviços advocatícios descritos no Quadro de Parâmetros da Contratação, observados o objeto e os limites ali definidos.' },
  { id: 2, title: 'DOS HONORÁRIOS', text: 'Os honorários devidos pela prestação dos serviços são aqueles estabelecidos no Quadro de Parâmetros da Contratação, que integra este contrato.\nI - O inadimplemento acarretará multa moratória de 1% ao mês e juros de mora de 2% ao mês, calculados pro rata die.\nII - Após 30 dias de atraso, poderá a CONTRATADA considerar rescindido o contrato e exigir o pagamento imediato dos valores devidos, além das despesas incorridas.' },
  { id: 3, title: 'DO INADIMPLEMENTO E SUSPENSÃO DA ATUAÇÃO', text: 'O inadimplemento autoriza a CONTRATADA a suspender a prática de atos não urgentes, sem prejuízo da adoção das medidas éticas cabíveis, inclusive renúncia ao mandato, permanecendo exigíveis os honorários vencidos e proporcionais ao trabalho realizado.' },
  { id: 4, title: 'DA CIÊNCIA, ADEQUAÇÃO E LIVRE PACTUAÇÃO', text: 'O CONTRATANTE declara que os honorários foram livremente pactuados, compatíveis com a complexidade da causa, grau de zelo profissional e tempo estimado de dedicação, tendo sido devidamente esclarecida a distinção entre honorários contratuais e sucumbenciais.' },
  { id: 5, title: 'DAS DESPESAS', text: 'Custas, taxas e despesas extraordinárias correrão por conta do CONTRATANTE, mediante prévia comunicação, podendo a CONTRATADA adiantar despesas de pequeno valor até o limite de R$ 150,00.' },
  { id: 6, title: 'DAS OBRIGAÇÕES DO CONTRATANTE', text: 'Compete ao CONTRATANTE fornecer informações e documentos verídicos, manter seus dados atualizados, arcar com despesas comunicadas e efetuar os pagamentos pactuados.' },
  { id: 7, title: 'DO ACORDO OU RECEBIMENTO DIRETO', text: 'Qualquer valor recebido direta ou indiretamente pelo CONTRATANTE, por acordo judicial, extrajudicial ou composição informal relacionada ao objeto deste contrato, ainda que sem a intervenção da CONTRATADA, tornará imediatamente exigíveis os honorários contratuais e de êxito previstos no Quadro de Parâmetros da Contratação.' },
  { id: 8, title: 'DA EXCLUSIVIDADE', text: 'O CONTRATANTE compromete-se a não constituir outro patrono para o mesmo objeto sem ciência da CONTRATADA, sob pena de exigibilidade integral dos honorários.' },
  { id: 9, title: 'DA RESCISÃO', text: 'O contrato poderá ser rescindido por qualquer das partes mediante notificação escrita. Em caso de rescisão imotivada, desistência ou revogação do mandato pelo CONTRATANTE, aplicam-se as condições previstas no Quadro de Parâmetros da Contratação, permanecendo irrestituível eventual valor pago a título de entrada, o qual será imputado aos serviços já prestados ou disponibilizados pela CONTRATADA, sem prejuízo da cobrança de valores adicionais proporcionais ao trabalho realizado e da multa rescisória, se prevista.' },
  { id: 10, title: 'DA IRREVOGABILIDADE E IRRETRATABILIDADE', text: 'O presente contrato é celebrado em caráter irrevogável e irretratável, ressalvadas as hipóteses legais ou rescisão por mútuo acordo.' },
  { id: 11, title: 'DO LEVANTAMENTO DE VALORES', text: 'A CONTRATADA poderá requerer a expedição de alvará em seu nome para levantamento de honorários contratuais e sucumbenciais.' },
  { id: 12, title: 'DA PROTEÇÃO DE DADOS', text: 'O tratamento de dados pessoais observará a Lei nº 13.709/2018, limitando-se ao necessário à execução deste contrato.' },
  { id: 13, title: 'DO COMPARTILHAMENTO DE DADOS', text: 'O CONTRATANTE autoriza o compartilhamento de seus dados pessoais com peritos, correspondentes jurídicos, tribunais, plataformas digitais e demais terceiros estritamente necessários à execução do objeto contratado, observadas as disposições da Lei nº 13.709/2018.' },
  { id: 14, title: 'DO SIGILO PROFISSIONAL', text: 'O CONTRATANTE compromete-se a não divulgar estratégias, documentos ou pareceres sem autorização prévia.' },
  { id: 15, title: 'DO SUBSTABELECIMENTO', text: 'A CONTRATADA poderá substabelecer os poderes recebidos, com ou sem reserva.' },
  { id: 16, title: 'DA VIGÊNCIA', text: 'A vigência perdurará até a conclusão da atuação definida no Quadro de Parâmetros da Contratação.' },
  { id: 17, title: 'DAS DISPOSIÇÕES GERAIS', text: 'A eventual tolerância ao descumprimento contratual não implica renúncia de direitos. As obrigações estendem-se aos sucessores das partes.' },
  { id: 18, title: 'DO FORO', text: 'Fica eleito o foro da Comarca de Silvânia-GO para dirimir controvérsias decorrentes deste contrato.' },
];

function strokeIcon(doc, color, weight, fn) {
  doc.setDrawColor(...color);
  doc.setLineWidth(weight);
  fn();
}

const ICONS = {
  person(doc, x, y, s, color) {
    strokeIcon(doc, color, s * 0.08, () => {
      doc.circle(x + s * 0.5, y + s * 0.24, s * 0.2, 'S');
      doc.roundedRect(x + s * 0.18, y + s * 0.5, s * 0.64, s * 0.46, s * 0.12, s * 0.12, 'S');
    });
  },
  document(doc, x, y, s, color) {
    strokeIcon(doc, color, s * 0.07, () => {
      doc.roundedRect(x + s * 0.14, y, s * 0.72, s, s * 0.06, s * 0.06, 'S');
      [0.3, 0.5, 0.7].forEach(fy => doc.line(x + s * 0.27, y + s * fy, x + s * 0.73, y + s * fy));
    });
  },
  check(doc, x, y, s, color) {
    strokeIcon(doc, color, s * 0.08, () => {
      doc.circle(x + s / 2, y + s / 2, s / 2 - s * 0.04, 'S');
      doc.line(x + s * 0.28, y + s * 0.52, x + s * 0.44, y + s * 0.68);
      doc.line(x + s * 0.44, y + s * 0.68, x + s * 0.74, y + s * 0.32);
    });
  },
  pen(doc, x, y, s, color) {
    strokeIcon(doc, color, s * 0.09, () => {
      doc.line(x + s * 0.1, y + s * 0.92, x + s * 0.78, y + s * 0.18);
      doc.line(x + s * 0.78, y + s * 0.18, x + s * 0.92, y + s * 0.06);
      doc.line(x + s * 0.08, y + s * 0.94, x + s * 0.18, y + s * 0.84);
    });
  },
  calendar(doc, x, y, s, color) {
    strokeIcon(doc, color, s * 0.07, () => {
      doc.roundedRect(x, y + s * 0.16, s, s * 0.8, s * 0.07, s * 0.07, 'S');
      doc.line(x + s * 0.2, y, x + s * 0.2, y + s * 0.3);
      doc.line(x + s * 0.8, y, x + s * 0.8, y + s * 0.3);
      doc.line(x, y + s * 0.42, x + s, y + s * 0.42);
    });
  },
  phone(doc, x, y, s, color) {
    strokeIcon(doc, color, s * 0.09, () => {
      doc.roundedRect(x + s * 0.28, y, s * 0.44, s, s * 0.14, s * 0.14, 'S');
      doc.line(x + s * 0.42, y + s * 0.84, x + s * 0.58, y + s * 0.84);
    });
  },
  pin(doc, x, y, s, color) {
    strokeIcon(doc, color, s * 0.08, () => {
      doc.circle(x + s / 2, y + s * 0.34, s * 0.3, 'S');
      doc.line(x + s * 0.28, y + s * 0.56, x + s * 0.5, y + s * 0.96);
      doc.line(x + s * 0.72, y + s * 0.56, x + s * 0.5, y + s * 0.96);
      doc.circle(x + s / 2, y + s * 0.34, s * 0.1, 'S');
    });
  },
  envelope(doc, x, y, s, color) {
    strokeIcon(doc, color, s * 0.07, () => {
      doc.rect(x, y + s * 0.16, s, s * 0.68, 'S');
      doc.line(x, y + s * 0.16, x + s / 2, y + s * 0.54);
      doc.line(x + s, y + s * 0.16, x + s / 2, y + s * 0.54);
    });
  },
};

function drawIcon(doc, type, x, y, s, color = GOLD) {
  const icon = ICONS[type];
  if (icon) icon(doc, x, y, s, color);
}

const state = {
  assets: {},
  previewUrl: null,
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function clean(value) {
  return String(value || '').trim();
}

function joinParts(parts, separator = ', ') {
  return parts.map(clean).filter(Boolean).join(separator);
}

function formatCPF(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
  const groups = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean);
  let result = groups.join('.');
  if (digits.length > 9) result += `-${digits.slice(9, 11)}`;
  return result;
}

function normalizeFilename(value) {
  return (clean(value) || 'contrato-de-honorarios')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'contrato-de-honorarios';
}

function formatLongDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getDraft() {
  const draft = { person: {}, params: {}, document: {}, clauses: {} };
  for (const element of form.elements) {
    if (!element.name) continue;
    const parts = element.name.split('.');
    if (parts[0] === 'clauses') {
      const [, id, field] = parts;
      draft.clauses[id] = draft.clauses[id] || {};
      draft.clauses[id][field] = element.type === 'checkbox' ? element.checked : element.value;
    } else {
      const [group, field] = parts;
      if (draft[group]) draft[group][field] = element.value;
    }
  }
  return draft;
}

function setDraft(draft) {
  for (const element of form.elements) {
    if (!element.name) continue;
    const parts = element.name.split('.');
    if (parts[0] === 'clauses') continue;
    const [group, field] = parts;
    const value = draft?.[group]?.[field];
    if (value != null) element.value = value;
  }
  if (!form.elements['document.date'].value) form.elements['document.date'].value = todayISO();
  updateParcelasVisibility();
}

function saveDraft() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getDraft()));
}

function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function updateParcelasVisibility() {
  const forma = form.elements['params.entradaForma']?.value;
  parcelasField.hidden = forma !== 'parcelado';
}

function autoSizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function autoSizeAllClauseTextareas() {
  clausesList.querySelectorAll('.clause-text').forEach(autoSizeTextarea);
}

function renderClausesUI(savedClauses = {}) {
  clausesList.innerHTML = '';
  DEFAULT_CLAUSES.forEach(clause => {
    const saved = savedClauses[clause.id] || {};
    const editing = saved.editing === true;
    const text = saved.text !== undefined ? saved.text : clause.text;

    const item = document.createElement('div');
    item.className = 'clause-item' + (editing ? ' is-editing' : '');

    const head = document.createElement('label');
    head.className = 'clause-head';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = `clauses.${clause.id}.editing`;
    checkbox.checked = editing;
    const span = document.createElement('span');
    span.textContent = `${clause.id}. ${clause.title}`;
    const small = document.createElement('small');
    small.textContent = 'Editar';
    span.appendChild(small);
    head.appendChild(checkbox);
    head.appendChild(span);

    const textarea = document.createElement('textarea');
    textarea.className = 'clause-text';
    textarea.name = `clauses.${clause.id}.text`;
    textarea.rows = 2;
    textarea.value = text;
    textarea.readOnly = !editing;

    checkbox.addEventListener('change', () => {
      item.classList.toggle('is-editing', checkbox.checked);
      textarea.readOnly = !checkbox.checked;
      autoSizeTextarea(textarea);
    });
    textarea.addEventListener('input', () => autoSizeTextarea(textarea));

    item.appendChild(head);
    item.appendChild(textarea);
    clausesList.appendChild(item);
  });
}

function setClausesToggle(open) {
  clausesList.hidden = !open;
  clausesHint.hidden = !open;
  clausesToggle.textContent = open
    ? 'Ocultar cláusulas contratuais'
    : `Mostrar cláusulas contratuais (${DEFAULT_CLAUSES.length})`;
  if (open) requestAnimationFrame(autoSizeAllClauseTextareas);
}

function getActiveClauses(draft) {
  return DEFAULT_CLAUSES
    .map(clause => {
      const saved = draft.clauses?.[clause.id] || {};
      return {
        title: clause.title,
        text: saved.text !== undefined ? saved.text : clause.text,
      };
    })
    .filter(c => clean(c.text));
}

function buildAddress(person) {
  const street = joinParts([
    person.street,
    person.number && `nº ${person.number}`,
    person.complement,
    person.neighborhood,
  ]);
  const cityState = joinParts([person.city, person.state], '/');
  const pieces = [];
  if (street) pieces.push(street);
  if (person.zip) pieces.push(`CEP: ${clean(person.zip)}`);
  if (cityState) pieces.push(cityState);
  return joinParts(pieces);
}

function buildContratanteText(person) {
  const segments = [];
  const identity = joinParts([
    clean(person.name).toUpperCase(),
    person.nationality,
    person.maritalStatus,
    person.profession,
  ]);
  if (identity) segments.push(identity);
  if (person.rg) {
    const issuer = clean(person.rgIssuer);
    segments.push(`portador(a) do RG nº ${clean(person.rg)}${issuer ? ` - ${issuer}` : ''}`);
  }
  if (person.cpf) segments.push(`inscrito(a) no CPF sob o nº ${formatCPF(person.cpf)}`);
  if (person.email) segments.push(`e-mail: ${clean(person.email)}`);
  if (person.phone) segments.push(`telefone/WhatsApp: ${clean(person.phone)}`);
  const address = buildAddress(person);
  if (address) segments.push(`residente e domiciliado(a) em ${address}`);
  return segments.length ? `${segments.join(', ')}.` : '';
}

function buildHonorariosBullets(p) {
  const bullets = [];
  const entradaParts = [];
  if (clean(p.entradaValor)) entradaParts.push(`R$ ${clean(p.entradaValor)}`);
  if (p.entradaForma === 'vista') entradaParts.push('à vista');
  else if (p.entradaForma === 'parcelado') entradaParts.push(`parcelado em ${clean(p.entradaParcelas) || 'X'} parcelas`);
  if (clean(p.entradaVencimento)) entradaParts.push(`vencimento em ${clean(p.entradaVencimento)}`);
  if (entradaParts.length) bullets.push({ label: 'Entrada', value: `${joinParts(entradaParts)}.` });

  if (clean(p.exitoPercentual)) {
    const base = clean(p.exitoBase) || 'valor principal, correção monetária e juros';
    bullets.push({ label: 'Honorários de êxito', value: `${clean(p.exitoPercentual)}% calculado sobre ${base}.` });
  }

  bullets.push({ label: 'Honorários de sucumbência', value: 'Pertencem integralmente à CONTRATADA.' });
  return bullets;
}

function buildRescisaoBullets(p) {
  const bullets = [{ label: null, value: 'Pagamento proporcional ao trabalho realizado.' }];
  if (clean(p.multaRescisoria)) bullets.push({ label: null, value: `Multa rescisória de ${clean(p.multaRescisoria)}%.` });
  return bullets;
}

function loadCroppedImage(src, crop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = crop.w;
      canvas.height = crop.h;
      canvas.getContext('2d').drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = reject;
    image.src = src;
  });
}

async function loadAssets() {
  const [logo, wordmark, watermark] = await Promise.all([
    loadCroppedImage('./assets/logo.png', { x: 200, y: 234, w: 623, h: 962 }),
    loadCroppedImage('./assets/wordmark.png', { x: 238, y: 384, w: 1068, h: 190 }),
    loadCroppedImage('./assets/watermark.png', { x: 23, y: 380, w: 1369, h: 1318 }),
  ]);
  state.assets = { logo, wordmark, watermark };
}

function drawWatermark(doc) {
  if (!state.assets.watermark) return;
  if (doc.GState && doc.setGState) doc.setGState(new doc.GState({ opacity: 0.1 }));
  doc.addImage(state.assets.watermark, 'PNG', 118, 86, 104, 100);
  if (doc.GState && doc.setGState) doc.setGState(new doc.GState({ opacity: 1 }));
}

function drawHeader(doc, title = 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS', fontSize = 11.5) {
  if (state.assets.logo) doc.addImage(state.assets.logo, 'PNG', 95.3, 5, 19.4, 30);
  if (state.assets.wordmark) doc.addImage(state.assets.wordmark, 'PNG', 74.1, 38, 61.8, 11);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.35);
  doc.line(0, 56, 210, 56);
  doc.setFont('times', 'bold');
  doc.setTextColor(...GOLD);
  doc.setFontSize(fontSize);
  doc.text(title, 105, 62, { align: 'center' });
}

function drawFooter(doc) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.25);
  doc.line(0, 274, 210, 274);
  doc.setLineWidth(0.8);
  doc.line(0, 294, 210, 294);
  doc.setLineWidth(0.3);
  doc.line(0, 296, 210, 296);
  doc.setFont('times', 'normal');
  doc.setTextColor(...FOOTER_GRAY);
  doc.setFontSize(9);

  const rows = [
    { icon: 'phone', text: '(62) 9 9316-1514', y: 282 },
    { icon: 'pin', text: 'GO-010, Km 67, Zona Rural, Silvânia-GO', y: 287, link: MAPS_URL },
    { icon: 'envelope', text: 'gregorioemorais.adv@gmail.com', y: 292 },
  ];
  const iconSize = 3;
  const gap = 1.6;
  rows.forEach(({ icon, text, y, link }) => {
    const textWidth = doc.getTextWidth(text);
    const startX = 105 - (iconSize + gap + textWidth) / 2;
    drawIcon(doc, icon, startX, y - iconSize * 0.78, iconSize, FOOTER_GRAY);
    if (link) doc.textWithLink(text, startX + iconSize + gap, y, { url: link });
    else doc.text(text, startX + iconSize + gap, y);
  });
}

function drawPageChrome(doc, title) {
  drawWatermark(doc);
  drawHeader(doc, title);
  drawFooter(doc);
}

function drawPersonIcon(doc, x, y) {
  drawIcon(doc, 'person', x + 1, y, 13, GOLD);
}

function drawSection(doc, title, text, y) {
  if (!text) return y;
  drawPersonIcon(doc, 20, y + 1);
  doc.setFont('times', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(...GOLD);
  doc.text(title, 44, y + 5);
  doc.setFont('times', 'normal');
  doc.setFontSize(10.6);
  doc.setTextColor(...GRAY);
  const lines = doc.splitTextToSize(text, 145);
  doc.text(lines, 44, y + 11, { lineHeightFactor: 1.22, align: 'justify', maxWidth: 145 });
  return y + Math.max(27, 13 + lines.length * 5.1);
}

const ITALIC_TERMS = ['pro rata die'];

function splitItalicSuffix(text) {
  for (const term of ITALIC_TERMS) {
    const idx = text.toLowerCase().lastIndexOf(term);
    if (idx === -1) continue;
    const after = text.slice(idx + term.length);
    if (/^[.,;]?\s*$/.test(after)) {
      return { before: text.slice(0, idx).trimEnd(), italic: text.slice(idx).trim() };
    }
  }
  return null;
}

function drawLeadParagraph(doc, label, value, x, y, maxWidth, lineHeight) {
  if (!value && !label) return y;
  let cursorY = y;

  if (label) {
    doc.setFont('times', 'bold');
    const labelLines = doc.splitTextToSize(label, maxWidth);
    doc.text(labelLines, x, cursorY, { lineHeightFactor: 1.18, align: 'justify', maxWidth });
    cursorY += labelLines.length * lineHeight;
  }

  const italicSplit = value ? splitItalicSuffix(value) : null;
  if (italicSplit) {
    doc.setFont('times', 'normal');
    const lines = doc.splitTextToSize(italicSplit.before, maxWidth);
    doc.text(lines, x, cursorY, { lineHeightFactor: 1.18, align: 'justify', maxWidth });
    cursorY += lines.length * lineHeight;
    doc.setFont('times', 'italic');
    doc.text(italicSplit.italic, x, cursorY);
    cursorY += lineHeight;
    doc.setFont('times', 'normal');
    return cursorY;
  }

  if (value) {
    doc.setFont('times', 'normal');
    const lines = doc.splitTextToSize(value, maxWidth);
    doc.text(lines, x, cursorY, { lineHeightFactor: 1.18, align: 'justify', maxWidth });
    cursorY += lines.length * lineHeight;
  }

  return cursorY;
}

function drawParamItem(doc, number, label, value, y, opts = {}) {
  if (!value) return y;
  const indent = opts.indent || 0;
  const x = LEFT + indent;
  const maxWidth = WIDTH - indent;
  const prefix = number != null ? `${number}. ` : '•  ';
  doc.setFontSize(10.3);
  doc.setTextColor(...GRAY);
  const y2 = label
    ? drawLeadParagraph(doc, `${prefix}${label}:`, value, x, y, maxWidth, 5)
    : drawLeadParagraph(doc, null, `${prefix}${value}`, x, y, maxWidth, 5);
  return y2 + 1.4;
}

function addContentPage(doc, title) {
  doc.addPage('a4', 'portrait');
  drawPageChrome(doc, title);
  return 69;
}

function drawParameters(doc, draft, y) {
  if (y > 235) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');
  doc.setDrawColor(35, 35, 35);
  doc.setLineWidth(0.2);
  doc.line(LEFT, y, LEFT + WIDTH, y);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...GOLD);
  doc.text('QUADRO DE PARÂMETROS DA CONTRATAÇÃO', 105, y + 6, { align: 'center' });
  doc.line(LEFT, y + 9, LEFT + WIDTH, y + 9);
  y += 15;

  const p = draft.params;
  const items = [];
  if (clean(p.objeto)) items.push({ label: 'Objeto da atuação jurídica', value: clean(p.objeto) });
  if (clean(p.limite)) items.push({ label: 'Limite da atuação', value: clean(p.limite) });
  items.push({ group: 'Honorários contratuais', bullets: buildHonorariosBullets(p) });
  if (clean(p.servicosIncluidos)) items.push({ label: 'Serviços incluídos', value: clean(p.servicosIncluidos) });
  if (clean(p.servicosNaoIncluidos)) items.push({ label: 'Serviços não incluídos (exigem aditivo contratual)', value: clean(p.servicosNaoIncluidos) });
  items.push({ group: 'Rescisão pelo CONTRATANTE', bullets: buildRescisaoBullets(p) });

  items.forEach((item, idx) => {
    const number = idx + 1;
    if (y > 250) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');
    if (item.group) {
      doc.setFont('times', 'bold');
      doc.setFontSize(10.3);
      doc.setTextColor(...GRAY);
      doc.text(`${number}.  ${item.group}:`, LEFT, y);
      y += 5.2;
      item.bullets.forEach(b => {
        if (y > 252) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');
        y = drawParamItem(doc, null, b.label, b.value, y, { indent: 8 });
      });
    } else {
      y = drawParamItem(doc, number, item.label, item.value, y, {});
    }
  });

  return y + 1;
}

function drawCommsNote(doc, draft, y) {
  if (y > 248) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');
  doc.setFont('times', 'italic');
  doc.setFontSize(9.6);
  doc.setTextColor(...GRAY);
  const note = 'Os canais de comunicação estão devidamente informados no rodapé, e o prazo médio para resposta é de até 3 dias úteis.';
  const lines = doc.splitTextToSize(note, WIDTH - 20);
  doc.text(lines, 105, y + 6, { align: 'center', lineHeightFactor: 1.25 });
  y += 6 + lines.length * 4.6;

  if (clean(draft.params.entradaValor)) {
    if (y > 258) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');
    doc.setFontSize(7.6);
    doc.setTextColor(140, 140, 142);
    const footnote = 'Eventual valor pago a título de entrada possui natureza de remuneração pelos atos iniciais, análise do caso, orientação jurídica, atendimento, organização documental e demais providências já prestadas ou colocadas à disposição do CONTRATANTE, razão pela qual, em caso de desistência, revogação do mandato ou rescisão por iniciativa do CONTRATANTE, não será restituído, total ou parcialmente.';
    const fnLines = doc.splitTextToSize(footnote, WIDTH - 6);
    doc.text(fnLines, LEFT, y + 4, { lineHeightFactor: 1.2, align: 'justify', maxWidth: WIDTH - 6 });
    y += 4 + fnLines.length * 3.6;
  }

  doc.setFont('times', 'normal');
  return y;
}

function drawClausesSection(doc, y, clauses) {
  if (!clauses.length) return y;
  if (y > 250) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');

  doc.setDrawColor(35, 35, 35);
  doc.setLineWidth(0.2);
  doc.line(LEFT, y, LEFT + WIDTH, y);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...GOLD);
  doc.text('DAS CLÁUSULAS CONTRATUAIS', 105, y + 6, { align: 'center' });
  doc.line(LEFT, y + 9, LEFT + WIDTH, y + 9);
  y += 15;

  clauses.forEach((clause, idx) => {
    const number = idx + 1;
    const paragraphs = clause.text.split('\n').map(clean).filter(Boolean);
    if (y > 250) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');
    doc.setFontSize(10.1);
    doc.setTextColor(...GRAY);
    y = drawLeadParagraph(doc, `${number}.  ${clause.title}:`, paragraphs[0] || '', LEFT, y, WIDTH, 4.9);
    for (let i = 1; i < paragraphs.length; i += 1) {
      if (y > 250) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');
      y = drawLeadParagraph(doc, null, paragraphs[i], LEFT + 6, y, WIDTH - 6, 4.9);
    }
    y += 2.4;
  });

  return y;
}

function drawDeclaration(doc, draft, y) {
  if (y > 248) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');
  doc.setFontSize(10.3);
  doc.setTextColor(...GRAY);
  y = drawLeadParagraph(doc, 'DECLARO', 'que li, compreendi e concordo com o Quadro de Parâmetros da Contratação e com todas as cláusulas deste instrumento.', LEFT, y, WIDTH, 5) + 4;

  const location = clean(draft.document.location);
  const date = formatLongDate(draft.document.date);
  const closing = joinParts([location, date]);
  if (closing) {
    if (y > 258) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');
    drawIcon(doc, 'calendar', LEFT, y - 4, 4, GOLD);
    doc.setFont('times', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(...GRAY);
    doc.text(`${closing}.`, LEFT + 6, y);
  }
  return y + 4;
}

function drawSignature(doc, label, x, y, width = 78) {
  drawIcon(doc, 'pen', x - 6.5, y - 4.5, 4.4, GRAY);
  doc.setDrawColor(100, 100, 102);
  doc.setLineWidth(0.25);
  doc.line(x, y, x + width, y);
  doc.setFont('times', 'bold');
  doc.setTextColor(...GRAY);
  doc.setFontSize(10.5);
  doc.text(label, x + width / 2, y + 6, { align: 'center' });
}

function generateDocument(draft = getDraft()) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  doc.setProperties({ title: 'Contrato de Honorários Advocatícios', author: 'Gregório & Morais Advogados' });
  drawPageChrome(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');

  let y = 69;
  y = drawSection(doc, 'CONTRATANTE', buildContratanteText(draft.person), y);
  y = drawSection(doc, 'CONTRATADA', CONTRATADA_TEXT, y);
  y = drawParameters(doc, draft, y + 2);
  y = drawCommsNote(doc, draft, y + 3);

  const clauses = getActiveClauses(draft);
  y = drawClausesSection(doc, y + 4, clauses);
  y = drawDeclaration(doc, draft, y + 4);
  if (y > 254) y = addContentPage(doc, 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS');
  drawSignature(doc, 'CONTRATANTE', 66, Math.min(258, y + 16), 78);

  return doc;
}

let previewTimer;

async function updatePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    loading.hidden = false;
    try {
      const doc = generateDocument();
      const blob = doc.output('blob');
      const previousUrl = state.previewUrl;
      state.previewUrl = URL.createObjectURL(blob);
      preview.src = 'about:blank';
      requestAnimationFrame(() => {
        preview.src = `${state.previewUrl}#view=FitH`;
        if (previousUrl) URL.revokeObjectURL(previousUrl);
      });
      pageCount.textContent = `${doc.getNumberOfPages()} página${doc.getNumberOfPages() === 1 ? '' : 's'} · A4`;
    } catch (error) {
      console.error(error);
      pageCount.textContent = 'Erro na prévia';
    } finally {
      loading.hidden = true;
    }
  }, 280);
}

form.elements['params.entradaForma']?.addEventListener('change', () => {
  updateParcelasVisibility();
});

clausesToggle.addEventListener('click', () => {
  setClausesToggle(clausesList.hidden);
});

function closeAllTips() {
  document.querySelectorAll('.field-hint .tip-bubble').forEach(bubble => bubble.remove());
}

document.querySelectorAll('.field-hint').forEach(hint => {
  hint.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const existing = hint.querySelector('.tip-bubble');
    closeAllTips();
    if (existing) return;
    const bubble = document.createElement('span');
    bubble.className = 'tip-bubble';
    bubble.textContent = hint.dataset.tip;
    hint.appendChild(bubble);
  });
});

document.addEventListener('click', () => closeAllTips());

form.addEventListener('input', () => {
  saveDraft();
  updatePreview();
});

form.addEventListener('change', () => {
  saveDraft();
  updatePreview();
});

['person.cpf'].forEach(name => {
  const input = form.elements[name];
  if (input) input.addEventListener('input', () => { input.value = formatCPF(input.value); });
});

document.getElementById('print').addEventListener('click', () => {
  try {
    preview.contentWindow.focus();
    preview.contentWindow.print();
  } catch (error) {
    console.error('Falha ao imprimir', error);
    if (state.previewUrl) window.open(state.previewUrl, '_blank');
  }
});

document.getElementById('download').addEventListener('click', () => {
  const draft = getDraft();
  const doc = generateDocument(draft);
  doc.save(`${normalizeFilename(draft.document.filename)}.pdf`);
});

document.getElementById('clear').addEventListener('click', () => {
  if (!confirm('Limpar todos os campos deste contrato?')) return;
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  renderClausesUI({});
  setClausesToggle(false);
  form.elements['document.location'].value = 'Silvânia/GO';
  form.elements['document.date'].value = todayISO();
  form.elements['document.filename'].value = 'contrato-de-honorarios';
  updateParcelasVisibility();
  updatePreview();
});

window.addEventListener('beforeunload', () => {
  if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
});

async function init() {
  const draft = loadDraft();
  renderClausesUI(draft.clauses || {});
  const anyEditing = Object.values(draft.clauses || {}).some(c => c.editing);
  setClausesToggle(anyEditing);
  setDraft(draft);
  try {
    await loadAssets();
  } catch (error) {
    console.error('Falha ao carregar identidade visual', error);
  }
  updatePreview();
}

init();
