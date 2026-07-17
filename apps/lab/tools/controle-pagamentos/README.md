# Controle de Pagamentos

App estático para GitHub Pages que guarda pessoas e pagamentos mensais no navegador e pode sincronizar tudo em um Gist privado.

## Execução

O módulo é publicado pelo workflow do OfficeJur em `/officejur/lab/controle-pagamentos/`. Durante o desenvolvimento, ele pode ser testado pelo site montado com `scripts/build-site.sh`.

## Gist

Na engrenagem do topo, informe:

- Gist ID, se já existir.
- Nome do arquivo, por padrão `controle-pagamentos.json`.
- Token do GitHub com permissão para Gists.

Também é possível criar um Gist privado direto pelo app. Os dados locais continuam funcionando mesmo sem Gist configurado.
