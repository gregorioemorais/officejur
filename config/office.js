(() => {
  const configUrl = document.currentScript?.src || document.baseURI;
  const assetUrl = (fileName) => new URL(fileName, configUrl).href;

  const office = Object.freeze({
    name: 'Gregório & Morais Advogados',
    shortName: 'Gregório & Morais',
    tagline: 'Advocacia e ferramentas internas',
    statementDescriptor: 'GREGORIO MORAIS',
    logoWhiteUrl: assetUrl('logo-white.png'),
    appIconUrl: assetUrl('app-icon.png')
  });

  const installation = Object.freeze({
    baseUrl: 'https://gregorioemorais.github.io/officejur/',
    origin: 'https://gregorioemorais.github.io',
    repositoryUrl: 'https://github.com/gregorioemorais/officejur'
  });

  const product = Object.freeze({
    name: 'OfficeJur',
    copyrightHolder: 'OfficeJur',
    copyrightStartYear: 2026
  });

  window.OFFICEJUR_CONFIG = Object.freeze({ office, installation, product });
})();
