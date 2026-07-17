# Validador Projudi

Módulo do OfficeJur para conferir PDFs e assinaturas `.p7s` antes do envio ao Projudi. Toda a análise acontece localmente no navegador; os documentos não são enviados nem armazenados.

## O que é verificado

- quantidade de páginas do PDF;
- tamanho total e tamanho médio por página;
- limite padrão de 200 KB por página, aplicado somente a documentos com mais de 10 páginas;
- estrutura CMS/PKCS#7 do arquivo `.p7s`;
- integridade criptográfica da assinatura;
- assinante, autoridade certificadora e período de validade do certificado.

O validador não consulta listas de revogação ou serviços OCSP e não substitui os validadores oficiais da ICP-Brasil.

## Desenvolvimento

```bash
npm install
npm run check
```

O HTML e os estilos vivem diretamente na pasta do aplicativo. O build gera apenas o JavaScript empacotado e o worker do PDF.js em `assets`, evitando manter uma segunda cópia em `public`.
