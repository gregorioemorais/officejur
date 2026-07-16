import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { averageKilobytes, violatesProjudiAverageLimit } from "../src/core.js";
import { parsePdf, parseP7s } from "../src/validation.js";

const directory = process.argv[2];
if (!directory) throw new Error("Informe a pasta com os arquivos de amostra.");

const names = (await readdir(directory)).filter(name => /\.pdf\.p7s$/i.test(name)).sort();
let failures = 0;

for (const name of names) {
  try {
    const path = resolve(directory, name);
    const bytes = await readFile(path);
    const signature = await parseP7s(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
    const pages = await parsePdf(signature.pdfBytes);
    const fileStat = await stat(path);
    const average = averageKilobytes(fileStat.size, pages);
    console.log(`${violatesProjudiAverageLimit(average, pages) ? "ERRO" : "OK"}\t${average.toFixed(1)} KB/pág\t${pages} pág\t${signature.signatureVerified ? "assinatura íntegra" : "assinatura inválida"}\t${name}`);
    if (!signature.signatureVerified) failures++;
  } catch (error) {
    failures++;
    console.error(`FALHA\t${name}\t${error.message}`);
  }
}

console.log(`\n${names.length} assinaturas analisadas; ${failures} falha(s) de integridade ou leitura.`);
if (failures) process.exitCode = 1;
