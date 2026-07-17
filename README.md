# OfficeJur

Sistema integrado de gestão e operações jurídicas da Gregório & Morais Advogados.

O OfficeJur reúne, em um único monorepo, o portal interno, os geradores de documentos, o sistema financeiro, as ferramentas operacionais permanentes e um laboratório para recursos em avaliação.

## Módulos

- **Portal** — acesso centralizado às ferramentas.
- **Documentos** — procuração, declaração de hipossuficiência, contrato de honorários e ciência de audiência.
- **Financeiro Jurídico** — clientes, casos, equipe, honorários, receitas, despesas, cobranças e relatórios.
- **Validador Projudi** — conferência local de PDFs e assinaturas P7S antes do protocolo.
- **Lab** — ferramentas temporárias e experimentais, atualmente Controle de Pagamentos e Central de Guias.

## Organização

```text
apps/
├── portal/
├── documentos/
│   ├── assets/                 # interface, imagens e jsPDF compartilhados
│   ├── procuracao/
│   ├── hipossuficiencia/
│   ├── honorarios/
│   └── ciencia-audiencia/
├── financeiro/
├── lab/
│   ├── assets/catalog.js      # catálogo das ferramentas disponíveis
│   └── tools/
│       ├── controle-pagamentos/
│       └── central-guias/
└── validador-projudi/

packages/
└── ui/
    ├── app-switcher.js
    └── site-footer.js
```

Os módulos continuam isolados internamente. Os geradores compartilham cabeçalho, estilos, imagens e jsPDF em `apps/documentos/assets`; todo o sistema compartilha a navegação e o rodapé institucional mantidos em `packages/ui`.

As bibliotecas de terceiros, suas versões, origens e licenças estão registradas em [Referências externas e créditos](REFERENCIAS-EXTERNAS.md).

## Publicação

O workflow `Publicar OfficeJur` monta todas as aplicações em um único artefato estático e o publica no GitHub Pages:

- `/officejur/` — portal;
- `/officejur/documentos/<modulo>/` — geradores de documentos;
- `/officejur/financeiro/` — financeiro;
- `/officejur/validador-projudi/` — validação de PDFs e assinaturas P7S;
- `/officejur/lab/` — catálogo do Laboratório;
- `/officejur/lab/controle-pagamentos/` — controle simplificado em avaliação;
- `/officejur/lab/central-guias/` — leitura de backups e consulta de guias.

Não há etapa de compilação das aplicações. O workflow apenas organiza os arquivos e injeta os componentes compartilhados no artefato publicado.

## Dados e credenciais

Dados jurídicos e financeiros não são arquivos da aplicação e não devem ser versionados. Tokens do GitHub permanecem somente no navegador, e credenciais privadas de integrações, como o Mercado Pago, permanecem em serviços protegidos.
