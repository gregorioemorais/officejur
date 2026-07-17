# OfficeJur Lab

O Lab isola ferramentas temporárias, experimentais ou em avaliação dos módulos permanentes do OfficeJur.

## Adicionar uma ferramenta

1. Crie `tools/<id>/index.html` e mantenha seus recursos dentro da mesma pasta.
2. Adicione a ferramenta em `assets/catalog.js`.
3. Inclua os componentes compartilhados `app-switcher.js`, `modal-scroll-lock.js` e `site-footer.js` no HTML. O build os injeta em `tools/<id>/assets`.

O build publica automaticamente cada pasta de `tools` em `/lab/<id>/`.

## Remover uma ferramenta

Remova sua pasta em `tools` e a entrada correspondente de `assets/catalog.js`. Nenhuma alteração no portal ou no app-switcher é necessária.

Ferramentas do Lab devem usar `current="lab"` no `office-app-switcher` para manter o Lab identificado como área atual.
