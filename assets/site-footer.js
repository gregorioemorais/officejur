(() => {
  const icon = {
    copyright: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15 9.5a4 4 0 1 0 0 5"/></svg>',
    info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.82a9.5 9.5 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
    organization: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18"/><path d="M5 18V9h14v9"/><path d="M9 18v-5h6v5"/><path d="M2 9h20L12 3 2 9Z"/></svg>'
  };

  const styles = `
    :host {
      display: block;
      width: 100%;
      color-scheme: dark;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    .site-footer {
      position: relative;
      display: grid;
      justify-items: center;
      gap: 14px;
      min-height: 154px;
      padding: 30px 20px 34px;
      border-top: 1px solid rgba(255,255,255,.14);
      color: rgba(248,250,252,.72);
      background:
        radial-gradient(circle at 50% 0, rgba(179,135,49,.1), transparent 42%),
        #121b32;
      text-align: center;
    }
    :host([embedded]) .site-footer {
      min-height: 0;
      margin-top: 34px;
      padding: 24px 0 0;
      background: transparent;
    }
    :host([sidebar]) {
      width: calc(100% - 230px);
      margin-left: 230px;
    }
    .credits {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 14px;
      font-weight: 650;
    }
    .credits > svg {
      width: 19px;
      height: 19px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
    }
    .info {
      display: inline-grid;
      place-items: center;
      width: 30px;
      height: 30px;
      border: 1px solid rgba(215,187,121,.48);
      border-radius: 50%;
      padding: 0;
      color: #d7bb79;
      background: rgba(255,255,255,.07);
      cursor: help;
    }
    .info svg {
      width: 19px;
      height: 19px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.9;
      stroke-linecap: round;
    }
    .info:focus-visible {
      outline: 3px solid rgba(215,187,121,.28);
      outline-offset: 3px;
    }
    .tooltip {
      position: absolute;
      left: 50%;
      bottom: calc(100% + 12px);
      z-index: 2;
      width: min(330px, calc(100vw - 40px));
      border: 1px solid rgba(215,187,121,.42);
      border-radius: 10px;
      padding: 12px 14px;
      color: #f8fafc;
      background: rgba(18,27,50,.98);
      box-shadow: 0 18px 44px rgba(0,0,0,.28);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.45;
      opacity: 0;
      pointer-events: none;
      text-align: left;
      transform: translate(-50%, 6px);
      transition: opacity .16s ease, transform .16s ease;
    }
    .info:hover + .tooltip,
    .info:focus-visible + .tooltip,
    .info:focus + .tooltip {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    .links {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .links a {
      display: inline-grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 10px;
      color: rgba(248,250,252,.84);
      background: rgba(255,255,255,.025);
      text-decoration: none;
      transition: color .16s ease, border-color .16s ease, background .16s ease, transform .16s ease;
    }
    .links a:hover {
      border-color: rgba(215,187,121,.58);
      color: #d7bb79;
      background: rgba(255,255,255,.08);
      transform: translateY(-2px);
    }
    .links a:focus-visible {
      outline: 3px solid rgba(215,187,121,.28);
      outline-offset: 2px;
    }
    .links svg {
      width: 22px;
      height: 22px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    @media (max-width: 720px) {
      :host([sidebar]) {
        width: 100%;
        margin-left: 0;
      }
      .site-footer { min-height: 142px; padding: 26px 16px 30px; }
      :host([embedded]) .site-footer { margin-top: 28px; padding-top: 22px; }
      .credits { font-size: 13px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .info + .tooltip, .links a { transition: none; }
    }
  `;

  class OfficeSiteFooter extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const repository = (this.getAttribute('repository') || '').trim();
      const year = new Date().getFullYear();
      const years = year === 2026 ? '2026' : `2026–${year}`;
      const repositoryUrl = repository
        ? `https://github.com/gregorioemorais/${encodeURIComponent(repository)}`
        : 'https://github.com/gregorioemorais';
      const repositoryLabel = repository
        ? `Repositório ${repository} no GitHub`
        : 'Organização Gregório e Morais no GitHub';
      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
        <style>${styles}</style>
        <footer class="site-footer">
          <span class="credits">
            ${icon.copyright}
            <span>${years} Vinícius Lourenço</span>
            <button class="info" type="button" aria-label="Informações sobre a criação dos projetos">
              ${icon.info}
            </button>
            <span class="tooltip" role="tooltip">Todos os projetos foram feitos com a ajuda de IA, incluindo Codex, Claude e ferramentas afins.</span>
          </span>
          <nav class="links" aria-label="Links institucionais">
            <a href="${repositoryUrl}" target="_blank" rel="noopener noreferrer" aria-label="${repositoryLabel}" title="${repositoryLabel}">
              ${icon.github}
            </a>
            <a href="https://github.com/gregorioemorais" target="_blank" rel="noopener noreferrer" aria-label="Organização Gregório e Morais no GitHub" title="Organização Gregório e Morais">
              ${icon.organization}
            </a>
          </nav>
        </footer>
      `;
    }
  }

  if (!customElements.get('office-site-footer')) {
    customElements.define('office-site-footer', OfficeSiteFooter);
  }
})();
