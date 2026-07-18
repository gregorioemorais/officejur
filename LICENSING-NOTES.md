# 🧭 Notas sobre o modelo de licenciamento

Este documento explica as escolhas adotadas no repositório. Ele não integra as
condições da licença e não substitui parecer jurídico.

## 🎯 Objetivos traduzidos em documentos

O modelo foi estruturado para:

- manter o código publicamente acessível;
- permitir estudo, auditoria, testes, avaliação e contribuição;
- impedir uso profissional ou operacional gratuito durante dez anos;
- exigir código-fonte de modificações compartilhadas ou acessíveis por rede;
- preservar autoria, procedência e distinção de forks;
- permitir licenciamento comercial separado;
- receber contribuições com cessão patrimonial expressa; e
- converter cada versão individualmente para AGPLv3 após dez anos.

## 🔒 Por que não é open source agora

A restrição de Uso em Produção discrimina finalidades de uso. Por isso, durante
o período restrito, o OfficeJur é **source-available**, e não open source.

Após a Data de Conversão, a Versão Específica passa à AGPLv3 e poderá ser usada
inclusive comercialmente, observadas as condições da AGPL e a política de marcas.

## ⏳ Por que não foi utilizada a BSL 1.1

A Business Source License 1.1 prevê conversão na data indicada ou, no máximo,
no quarto aniversário da primeira distribuição pública da versão, o que ocorrer
primeiro. Seu texto também condiciona o uso do nome BSL à preservação das regras
padronizadas.

Como o OfficeJur pretende utilizar prazo de dez anos e obrigações próprias de
compartilhamento de código, foi criada uma licença independente. O projeto não
utiliza o nome nem o identificador da BSL.

## 🗓️ Como contar os dez anos

Cada tag ou release é uma Versão Específica. Se não houver tag ou release, o
hash de commit identifica a versão. A data pública registrada no repositório
inicia a contagem, e a conversão ocorre no décimo aniversário.

Uma modificação de terceiro não reinicia o prazo. Se combinar versões oficiais
com datas diferentes, aplica-se a Data de Conversão mais recente entre elas.

## 👤 Premissas adotadas nesta versão

- **Titular indicado:** Vinícius Lourenço, pessoa física, conforme autoria
  identificada no histórico do repositório.
- **Licença comercial:** condições personalizadas por contrato; nenhum modelo
  de preço foi presumido.
- **Ensino:** permitido gratuitamente apenas em ambiente simulado e sem Uso em
  Produção ou dados reais.
- **Contribuições:** exigem cessão por escrito, específica para o pull request e
  expressamente gratuita.

Se o titular passar a ser uma pessoa jurídica ou se alguma premissa mudar, todos
os documentos relacionados deverão ser revisados em conjunto.

## 📚 Referências oficiais consultadas

- [Lei nº 9.609/1998 — proteção de programas de computador](https://www2.camara.leg.br/legin/fed/lei/1998/lei-9609-19-fevereiro-1998-364738-publicacaooriginal-1-pl.html)
- [Lei nº 9.610/1998 — direitos autorais e cessão](https://www2.camara.leg.br/legin/fed/lei/1998/lei-9610-19-fevereiro-1998-365399-normaatualizada-pl.html)
- [Decreto nº 2.556/1998 — cessão de direitos sobre programas](https://www2.camara.leg.br/legin/fed/decret/1998/decreto-2556-20-abril-1998-400776-publicacaooriginal-1-pe.html)
- [GNU Affero General Public License, versão 3](https://www.gnu.org/licenses/agpl-3.0.html)
- [Business Source License 1.1 — texto oficial da MariaDB](https://mariadb.com/bsl11/)

## ⚠️ Próxima etapa recomendada

Antes da primeira licença comercial, aceite de contribuição externa ou medida
de fiscalização, um advogado especializado em propriedade intelectual e
contratos de software deve revisar, no mínimo:

1. identificação e cadeia de titularidade;
2. validade e alcance da restrição de Uso em Produção;
3. mecanismo de conversão futura para AGPLv3;
4. instrumento e processo de assinatura da cessão;
5. política de marcas e eventual registro; e
6. compatibilidade das dependências e dos modelos documentais.
