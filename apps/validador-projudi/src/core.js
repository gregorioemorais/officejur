export const DEFAULT_LIMIT_KB = 200;
export const MIN_PAGES_FOR_AVERAGE_LIMIT = 10;

export function normalizeFileName(name) {
  return name.normalize("NFC").toLocaleLowerCase("pt-BR");
}

export function originalNameFor(fileName) {
  return fileName.replace(/\.p7s$/i, "");
}

export function isPdf(fileName) {
  return /\.pdf$/i.test(fileName);
}

export function isP7s(fileName) {
  return /\.p7s$/i.test(fileName);
}

export function averageKilobytes(fileSize, pageCount) {
  if (!Number.isFinite(fileSize) || !Number.isInteger(pageCount) || pageCount < 1) return null;
  return fileSize / 1024 / pageCount;
}

export function exceedsLimit(average, limit = DEFAULT_LIMIT_KB) {
  return Number.isFinite(average) && average > limit;
}

export function violatesProjudiAverageLimit(
  average,
  pageCount,
  limit = DEFAULT_LIMIT_KB,
  minimumPages = MIN_PAGES_FOR_AVERAGE_LIMIT
) {
  return Number.isInteger(pageCount)
    && pageCount > minimumPages
    && exceedsLimit(average, limit);
}

export function formatKilobytes(value) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value) + " KB";
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return formatKilobytes(bytes / 1024);
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(bytes / 1024 ** 2) + " MB";
}

export function compareResults(a, b) {
  const rank = { error: 0, checking: 1, ready: 2, reference: 3 };
  return (rank[a.status] ?? 9) - (rank[b.status] ?? 9)
    || a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
}
