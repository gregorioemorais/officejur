(() => {
  const config = window.OFFICEJUR_CONFIG;
  if (!config) {
    console.warn('A configuração do OfficeJur não foi carregada.');
    return;
  }

  const valueAt = (path) => path
    .split('.')
    .reduce((value, key) => value?.[key], config);
  const resolveUrl = (value) => new URL(
    String(value),
    config.installation?.baseUrl || document.baseURI,
  ).href;

  const apply = () => {
    document.querySelectorAll('[data-officejur-field]').forEach((node) => {
      const value = valueAt(node.dataset.officejurField);
      if (value != null) node.textContent = String(value);
    });

    document.querySelectorAll('[data-officejur-placeholder]').forEach((node) => {
      const value = valueAt(node.dataset.officejurPlaceholder);
      if (value != null) node.setAttribute('placeholder', String(value));
    });

    document.querySelectorAll('[data-officejur-href]').forEach((node) => {
      const value = valueAt(node.dataset.officejurHref);
      if (value != null) node.setAttribute('href', resolveUrl(value));
    });

    document.querySelectorAll('[data-officejur-src]').forEach((node) => {
      const value = valueAt(node.dataset.officejurSrc);
      if (value != null) {
        node.setAttribute('src', resolveUrl(value));
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
