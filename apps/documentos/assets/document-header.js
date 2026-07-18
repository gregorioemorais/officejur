(() => {
  const officeName = window.OFFICEJUR_CONFIG?.office?.name || 'Escritório não configurado';
  const baseUrl = window.OFFICEJUR_CONFIG?.installation?.baseUrl || document.baseURI;
  const logoWhiteUrl = new URL(
    window.OFFICEJUR_CONFIG?.office?.logoWhiteUrl || 'assets/logo-white.png',
    baseUrl,
  ).href;
  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  class OfficeDocumentHeader extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready === 'true') return;

      const title = (this.getAttribute('title') || 'Gerador de documentos').trim();
      const current = (this.getAttribute('current') || '').trim();
      const label = (this.getAttribute('aria-label') || `Gerador de ${title}`).trim();

      this.innerHTML = `
        <header class="topbar">
          <a class="brand" href="./" aria-label="${label}">
            <img src="${escapeHtml(logoWhiteUrl)}" alt="">
            <span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(officeName)}</small></span>
          </a>
          <div class="top-actions">
            <button id="import" class="button secondary" type="button">Importar</button>
            <input id="import-file" type="file" accept="application/pdf,.pdf" hidden>
            <button id="clear" class="button secondary" type="button">Limpar</button>
            <button id="print" class="button secondary" type="button">Imprimir</button>
            <button id="download" class="button primary" type="button">Gerar PDF</button>
            <office-app-switcher current="${current}"></office-app-switcher>
          </div>
        </header>
      `;
      this.dataset.ready = 'true';
    }
  }

  if (!customElements.get('office-document-header')) {
    customElements.define('office-document-header', OfficeDocumentHeader);
  }
})();
