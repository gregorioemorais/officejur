import test from "node:test";
import assert from "node:assert/strict";
import {
  averageKilobytes,
  exceedsLimit,
  isP7s,
  isPdf,
  normalizeFileName,
  originalNameFor,
  violatesProjudiAverageLimit
} from "../src/core.js";

test("calcula a média binária por página usada no diagnóstico", () => {
  assert.equal(averageKilobytes(4_213_086, 13).toFixed(1), "316.5");
  assert.equal(exceedsLimit(316.5, 200), true);
  assert.equal(exceedsLimit(200, 200), false);
});

test("aplica o limite médio apenas acima de dez páginas", () => {
  assert.equal(violatesProjudiAverageLimit(600, 1, 200), false);
  assert.equal(violatesProjudiAverageLimit(600, 10, 200), false);
  assert.equal(violatesProjudiAverageLimit(201, 11, 200), true);
  assert.equal(violatesProjudiAverageLimit(200, 11, 200), false);
});

test("reconhece arquivos PDF e P7S sem diferenciar maiúsculas", () => {
  assert.equal(isPdf("Documento.PDF"), true);
  assert.equal(isP7s("Documento.PDF.P7S"), true);
  assert.equal(isP7s("Documento.pdf"), false);
});

test("relaciona o P7S com o nome do PDF original", () => {
  assert.equal(originalNameFor("Procuração.pdf.p7s"), "Procuração.pdf");
  assert.equal(normalizeFileName("CEDULA.PDF"), "cedula.pdf");
});
