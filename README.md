# OfficeJur

Produto integrado de gestão e operações jurídicas para escritórios de advocacia.

O OfficeJur reúne, em um único monorepo, o portal interno, os geradores de documentos, o sistema financeiro, as ferramentas operacionais permanentes e um laboratório para recursos em avaliação.

## Módulos

- **Portal** — acesso centralizado às ferramentas.
- **Documentos** — procuração, declaração de hipossuficiência, contrato de honorários e ciência de audiência.
- **Financeiro Jurídico** — clientes, casos, equipe, honorários, receitas, despesas, cobranças e relatórios.
- **Validador Projudi** — conferência local de PDFs e assinaturas P7S antes do protocolo.
- **Lab** — ferramentas temporárias e experimentais, atualmente Controle de Pagamentos e Central de Guias.

## Organização

```text
config/
└── office.js                  # identidade e implantação do escritório

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
    ├── assets/                 # identidade visual institucional compartilhada
    ├── app-switcher.js
    └── site-footer.js
```

## Configuração do escritório

A instalação é personalizada em `config/office.js`. Esse arquivo concentra o nome do escritório, nome curto, descrição institucional, identificação para cobranças, URLs da implantação e caminhos dos elementos visuais.

Os módulos exibem o OfficeJur como produto e consomem os dados do escritório como contexto da instalação. Para trocar de escritório, edite a configuração e substitua os arquivos visuais indicados nela; não é necessário alterar cada aplicação.

Os modelos de documentos ainda pertencem à implantação atual e não consomem essa configuração. Essa separação é intencional até que seja definido um formato seguro para parametrizar textos jurídicos, profissionais, assinaturas e identidade documental.

Os módulos continuam isolados internamente. Os geradores compartilham cabeçalho, estilos, imagens documentais e jsPDF em `apps/documentos/assets`; todo o sistema compartilha navegação, rodapé e imagens institucionais mantidos em `packages/ui`.

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
