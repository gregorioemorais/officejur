(() => {
  const APPS = [
    {
      id: 'main',
      name: 'Início',
      description: 'Todas as ferramentas',
      url: 'https://gregorioemorais.github.io/main/',
      color: '#17213a',
      icon: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M9.5 20v-6h5v6"/>'
    },
    {
      id: 'financeiro',
      name: 'Financeiro',
      description: 'Gestão financeira',
      url: 'https://gregorioemorais.github.io/financeiro/',
      color: '#16805d',
      icon: '<path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19H2"/>'
    },
    {
      id: 'procuracao',
      name: 'Procuração',
      description: 'Gerador de procurações',
      url: 'https://gregorioemorais.github.io/procuracao/',
      color: '#3568b8',
      icon: '<path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/><path d="M9 13l2 2 4-4"/><path d="M9 3h6v4H9z"/>'
    },
    {
      id: 'honorarios',
      name: 'Honorários',
      description: 'Contratos advocatícios',
      url: 'https://gregorioemorais.github.io/honorarios/',
      color: '#a06b19',
      icon: '<path d="M12 3v18"/><path d="M5 7h14"/><path d="m5 7-3 6h6L5 7Z"/><path d="m19 7-3 6h6l-3-6Z"/><path d="M8 21h8"/>'
    },
    {
      id: 'hipossuficiencia',
      name: 'Hipossuficiência',
      description: 'Declarações de renda',
      url: 'https://gregorioemorais.github.io/hipossuficiencia/',
      color: '#7653a6',
      icon: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h8"/><path d="M9 17h6"/>'
    },
    {
      id: 'ciencia-audiencia',
      name: 'Ciência',
      description: 'Ciência de audiência',
      url: 'https://gregorioemorais.github.io/ciencia-audiencia/',
      color: '#b84d52',
      icon: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="m8 15 2 2 5-5"/>'
    }
  ];

  const dotsIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="19" cy="5" r="1.7"/><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/><circle cx="5" cy="19" r="1.7"/><circle cx="12" cy="19" r="1.7"/><circle cx="19" cy="19" r="1.7"/></svg>';

  const styles = `
    :host {
      position: relative;
      display: inline-flex;
      flex: 0 0 auto;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color-scheme: light;
    }
    :host([portal]) {
      position: absolute;
      top: 34px;
      right: 0;
      z-index: 100;
    }
    * { box-sizing: border-box; }
    .launcher {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      min-width: 42px;
      min-height: 42px;
      margin: 0;
      border: 1px solid rgba(255,255,255,.24);
      border-radius: 50%;
      padding: 0;
      color: #fff;
      background: rgba(255,255,255,.08);
      cursor: pointer;
      transition: background .16s ease, border-color .16s ease, transform .16s ease;
    }
    .launcher:hover {
      border-color: rgba(255,255,255,.42);
      background: rgba(255,255,255,.16);
      transform: translateY(-1px);
    }
    .launcher:focus-visible {
      outline: 3px solid rgba(217,189,122,.55);
      outline-offset: 2px;
    }
    .launcher svg { width: 23px; height: 23px; fill: currentColor; }
    .panel {
      position: absolute;
      top: calc(100% + 11px);
      right: 0;
      z-index: 1000;
      width: min(354px, calc(100vw - 24px));
      border: 1px solid #d8dee8;
      border-radius: 20px;
      padding: 16px;
      color: #182033;
      background: #f4f7fb;
      box-shadow: 0 22px 60px rgba(12,22,42,.28), 0 4px 14px rgba(12,22,42,.12);
    }
    .panel[hidden] { display: none; }
    .panel-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 2px 4px 14px;
    }
    .panel-head strong {
      display: block;
      color: #17213a;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 19px;
      line-height: 1.1;
    }
    .panel-head span {
      display: block;
      margin-top: 3px;
      color: #667085;
      font-size: 11px;
      font-weight: 650;
    }
    .office-mark {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      color: #fff;
      background: #17213a;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 16px;
      font-weight: 700;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 7px;
      border: 1px solid #e2e7ee;
      border-radius: 15px;
      padding: 8px;
      background: #fff;
    }
    .app {
      position: relative;
      display: grid;
      justify-items: center;
      align-content: start;
      min-width: 0;
      min-height: 112px;
      border: 1px solid transparent;
      border-radius: 13px;
      padding: 10px 5px 8px;
      color: #344054;
      text-align: center;
      text-decoration: none;
      transition: background .14s ease, border-color .14s ease, transform .14s ease;
    }
    .app:hover {
      border-color: #e0e6ef;
      background: #f5f7fb;
      transform: translateY(-1px);
    }
    .app:focus-visible {
      outline: 3px solid rgba(53,104,184,.24);
      outline-offset: 1px;
    }
    .app[aria-current="page"] {
      border-color: #d7e3f5;
      background: #edf3fc;
    }
    .icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 13px;
      color: #fff;
      background: var(--app-color);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.15), 0 5px 12px color-mix(in srgb, var(--app-color) 26%, transparent);
    }
    .icon svg {
      width: 25px;
      height: 25px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .name {
      display: block;
      width: 100%;
      margin-top: 8px;
      overflow: hidden;
      color: #182033;
      font-size: 12px;
      font-weight: 780;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .current {
      display: block;
      margin-top: 3px;
      color: #3568b8;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .04em;
      text-transform: uppercase;
    }
    @media (max-width: 560px) {
      :host([portal]) { top: 22px; right: 0; }
      .panel { width: min(330px, calc(100vw - 24px)); padding: 13px; border-radius: 17px; }
      .grid { gap: 4px; padding: 6px; }
      .app { min-height: 105px; padding-inline: 3px; }
      .name { font-size: 11px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .launcher, .app { transition: none; }
    }
  `;

  class OfficeAppSwitcher extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;

      const currentId = this.getAttribute('current') || this.detectCurrentApp();
      const currentApp = APPS.find((app) => app.id === currentId);
      const root = this.attachShadow({ mode: 'open' });
      const items = APPS.map((app) => {
        const isCurrent = app.id === currentId;
        return `
          <a class="app" href="${app.url}" title="${app.description}" ${isCurrent ? 'aria-current="page"' : ''}>
            <span class="icon" style="--app-color: ${app.color}">
              <svg viewBox="0 0 24 24" aria-hidden="true">${app.icon}</svg>
            </span>
            <span class="name">${app.name}</span>
            ${isCurrent ? '<span class="current">Atual</span>' : ''}
          </a>
        `;
      }).join('');

      root.innerHTML = `
        <style>${styles}</style>
        <button class="launcher" type="button" aria-label="Abrir menu de sistemas" aria-haspopup="true" aria-expanded="false" title="Sistemas do escritório">
          ${dotsIcon}
        </button>
        <section class="panel" aria-label="Sistemas do escritório" hidden>
          <div class="panel-head">
            <div><strong>Sistemas</strong><span>Gregório &amp; Morais Advogados</span></div>
            <span class="office-mark" aria-hidden="true">G&amp;M</span>
          </div>
          <nav class="grid" aria-label="Alternar sistema">${items}</nav>
        </section>
      `;

      this.button = root.querySelector('.launcher');
      this.panel = root.querySelector('.panel');
      this.button.setAttribute('aria-label', currentApp
        ? `Abrir menu de sistemas. Sistema atual: ${currentApp.name}`
        : 'Abrir menu de sistemas');

      this.onButtonClick = () => this.setOpen(this.panel.hidden);
      this.onDocumentClick = (event) => {
        if (!event.composedPath().includes(this)) this.setOpen(false);
      };
      this.onKeyDown = (event) => {
        if (event.key === 'Escape' && !this.panel.hidden) {
          this.setOpen(false);
          this.button.focus();
        }
      };

      this.button.addEventListener('click', this.onButtonClick);
      document.addEventListener('click', this.onDocumentClick);
      document.addEventListener('keydown', this.onKeyDown);
    }

    disconnectedCallback() {
      document.removeEventListener('click', this.onDocumentClick);
      document.removeEventListener('keydown', this.onKeyDown);
    }

    detectCurrentApp() {
      const path = window.location.pathname.toLowerCase();
      return APPS.find((app) => path.includes(`/${app.id}/`))?.id || 'main';
    }

    setOpen(open) {
      this.panel.hidden = !open;
      this.button.setAttribute('aria-expanded', String(open));
      if (open) this.shadowRoot.querySelector('.app')?.focus();
    }
  }

  if (!customElements.get('office-app-switcher')) {
    customElements.define('office-app-switcher', OfficeAppSwitcher);
  }
})();
