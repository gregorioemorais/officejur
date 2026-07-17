(() => {
  "use strict";

  const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
  const monthOf = (value) => (validDate(value) ? String(value).slice(0, 7) : "");

  function cashDateOf(entry = {}) {
    return validDate(entry.paidDate) ? entry.paidDate : entry.dueDate;
  }

  function previousMonths(selectedMonth, count = 6) {
    if (!/^\d{4}-\d{2}$/.test(String(selectedMonth || ""))) return [];
    const [year, month] = selectedMonth.split("-").map(Number);
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(Date.UTC(year, month - count + index, 1));
      return date.toISOString().slice(0, 7);
    });
  }

  function cashFlowSeries(entries, selectedMonth, count = 6) {
    return previousMonths(selectedMonth, count).map((month) => {
      const values = (Array.isArray(entries) ? entries : []).reduce(
        (total, entry) => {
          if (entry?.status !== "paid" || monthOf(cashDateOf(entry)) !== month) {
            return total;
          }
          const amount = Number(entry.amount || 0);
          if (!Number.isFinite(amount)) return total;
          if (entry.kind === "income") total.income += amount;
          if (entry.kind === "expense") total.expense += amount;
          return total;
        },
        { income: 0, expense: 0 },
      );
      return { month, ...values };
    });
  }

  const api = { cashDateOf, cashFlowSeries, previousMonths };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  globalThis.FinanceMetrics = api;
})();
