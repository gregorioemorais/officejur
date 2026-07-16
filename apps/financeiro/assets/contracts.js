(() => {
  "use strict";

  const FIXED_MODES = new Set(["cash", "installments", "monthly", "stages"]);
  const AGREEMENT_MODES = new Set([
    ...FIXED_MODES,
    "success",
    "mixed",
    "custom",
  ]);

  const blankAgreement = () => ({
    mode: "",
    fixedMode: "",
    totalAmount: "",
    cashDueDate: "",
    downPaymentAmount: "",
    downPaymentDueDate: "",
    installmentCount: "",
    firstInstallmentDueDate: "",
    monthlyAmount: "",
    monthlyCount: "",
    firstMonthlyDueDate: "",
    stages: [],
    successRate: "",
    successBase: "",
    successCondition: "",
    customTerms: "",
  });

  const text = (value) => String(value ?? "").trim();
  const numberOrBlank = (value) => {
    if (value === "" || value === null || value === undefined) return "";
    const number = Number(value);
    return Number.isFinite(number) ? number : "";
  };
  const positiveIntegerOrBlank = (value) => {
    const number = numberOrBlank(value);
    return number === "" ? "" : Math.max(0, Math.trunc(number));
  };
  const cents = (value) => Math.round(Number(value || 0) * 100);
  const amount = (value) => Number((value / 100).toFixed(2));

  function normalizeAgreement(raw = {}) {
    const agreement = blankAgreement();
    agreement.mode = AGREEMENT_MODES.has(raw.mode) ? raw.mode : "";
    agreement.fixedMode = FIXED_MODES.has(raw.fixedMode) ? raw.fixedMode : "";
    agreement.totalAmount = numberOrBlank(raw.totalAmount);
    agreement.cashDueDate = text(raw.cashDueDate);
    agreement.downPaymentAmount = numberOrBlank(raw.downPaymentAmount);
    agreement.downPaymentDueDate = text(raw.downPaymentDueDate);
    agreement.installmentCount = positiveIntegerOrBlank(raw.installmentCount);
    agreement.firstInstallmentDueDate = text(raw.firstInstallmentDueDate);
    agreement.monthlyAmount = numberOrBlank(raw.monthlyAmount);
    agreement.monthlyCount = positiveIntegerOrBlank(raw.monthlyCount);
    agreement.firstMonthlyDueDate = text(raw.firstMonthlyDueDate);
    agreement.stages = (Array.isArray(raw.stages) ? raw.stages : []).map(
      (stage) => ({
        id: text(stage.id),
        description: text(stage.description),
        amount: numberOrBlank(stage.amount),
        dueDate: text(stage.dueDate),
      }),
    );
    agreement.successRate = numberOrBlank(raw.successRate);
    agreement.successBase = text(raw.successBase);
    agreement.successCondition = text(raw.successCondition);
    agreement.customTerms = text(raw.customTerms);
    return agreement;
  }

  function addMonths(date, months) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
    const [year, month, day] = date.split("-").map(Number);
    const target = new Date(Date.UTC(year, month - 1 + months, 1));
    const lastDay = new Date(
      Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
    ).getUTCDate();
    target.setUTCDate(Math.min(day, lastDay));
    return target.toISOString().slice(0, 10);
  }

  function fixedModeOf(agreement) {
    return agreement.mode === "mixed" ? agreement.fixedMode : agreement.mode;
  }

  function validateAgreement(raw) {
    const agreement = normalizeAgreement(raw);
    const errors = [];
    const fixedMode = fixedModeOf(agreement);
    const total = Number(agreement.totalAmount || 0);
    const downPayment = Number(agreement.downPaymentAmount || 0);

    if (!agreement.mode) errors.push("Selecione a modalidade de contratação.");
    if (agreement.mode === "mixed" && !fixedMode) {
      errors.push("Selecione a forma da parte fixa da contratação mista.");
    }
    if (fixedMode === "cash") {
      if (total <= 0) errors.push("Informe o valor à vista.");
      if (!agreement.cashDueDate)
        errors.push("Informe o vencimento do valor à vista.");
    }
    if (fixedMode === "installments") {
      if (total <= 0) errors.push("Informe o valor total da contratação.");
      if (downPayment < 0 || downPayment > total) {
        errors.push(
          "A entrada não pode ser negativa nem superar o valor total.",
        );
      }
      if (downPayment > 0 && !agreement.downPaymentDueDate) {
        errors.push("Informe o vencimento da entrada.");
      }
      if (!agreement.installmentCount)
        errors.push("Informe a quantidade de parcelas.");
      if (!agreement.firstInstallmentDueDate) {
        errors.push("Informe o vencimento da primeira parcela.");
      }
      if (total > 0 && downPayment >= total) {
        errors.push("A entrada deve deixar saldo para as parcelas.");
      }
    }
    if (fixedMode === "monthly") {
      if (Number(agreement.monthlyAmount || 0) <= 0) {
        errors.push("Informe o valor mensal.");
      }
      if (!agreement.monthlyCount)
        errors.push("Informe a quantidade de mensalidades.");
      if (!agreement.firstMonthlyDueDate) {
        errors.push("Informe o vencimento da primeira mensalidade.");
      }
    }
    if (fixedMode === "stages") {
      if (!agreement.stages.length) errors.push("Adicione ao menos uma etapa.");
      agreement.stages.forEach((stage, index) => {
        if (
          !stage.description ||
          Number(stage.amount || 0) <= 0 ||
          !stage.dueDate
        ) {
          errors.push(
            `Complete a descrição, o valor e o vencimento da etapa ${index + 1}.`,
          );
        }
      });
    }
    if (agreement.mode === "success" || agreement.mode === "mixed") {
      const rate = Number(agreement.successRate || 0);
      if (rate <= 0 || rate > 100) {
        errors.push("Informe um percentual de êxito entre 0 e 100%.");
      }
    }
    if (agreement.mode === "custom" && !agreement.customTerms) {
      errors.push("Descreva as condições da contratação personalizada.");
    }
    return errors;
  }

  function splitInstallments(totalCents, count) {
    const base = Math.floor(totalCents / count);
    const remainder = totalCents - base * count;
    return Array.from(
      { length: count },
      (_, index) => base + (index < remainder ? 1 : 0),
    );
  }

  function buildSchedule(raw) {
    const agreement = normalizeAgreement(raw);
    if (validateAgreement(agreement).length) return [];
    const fixedMode = fixedModeOf(agreement);

    if (fixedMode === "cash") {
      return [
        {
          id: "cash",
          description: "Honorários à vista",
          category: "Honorários fixos",
          amount: amount(cents(agreement.totalAmount)),
          dueDate: agreement.cashDueDate,
        },
      ];
    }

    if (fixedMode === "installments") {
      const totalCents = cents(agreement.totalAmount);
      const downPaymentCents = cents(agreement.downPaymentAmount);
      const installments = splitInstallments(
        totalCents - downPaymentCents,
        agreement.installmentCount,
      );
      const schedule =
        downPaymentCents > 0
          ? [
              {
                id: "down-payment",
                description: "Entrada dos honorários",
                category: "Honorários parcelados",
                amount: amount(downPaymentCents),
                dueDate: agreement.downPaymentDueDate,
              },
            ]
          : [];
      installments.forEach((installment, index) =>
        schedule.push({
          id: `installment-${index + 1}`,
          description: `${index + 1}ª parcela dos honorários`,
          category: "Honorários parcelados",
          amount: amount(installment),
          dueDate: addMonths(agreement.firstInstallmentDueDate, index),
        }),
      );
      return schedule;
    }

    if (fixedMode === "monthly") {
      return Array.from({ length: agreement.monthlyCount }, (_, index) => ({
        id: `monthly-${index + 1}`,
        description: `${index + 1}ª mensalidade de honorários`,
        category: "Honorários mensais",
        amount: amount(cents(agreement.monthlyAmount)),
        dueDate: addMonths(agreement.firstMonthlyDueDate, index),
      }));
    }

    if (fixedMode === "stages") {
      return agreement.stages.map((stage, index) => ({
        id: stage.id || `stage-${index + 1}`,
        description: stage.description,
        category: "Honorários por etapa",
        amount: amount(cents(stage.amount)),
        dueDate: stage.dueDate,
      }));
    }

    return [];
  }

  function fixedTotal(raw) {
    return Number(
      buildSchedule(raw)
        .reduce((sum, item) => sum + item.amount, 0)
        .toFixed(2),
    );
  }

  const api = {
    AGREEMENT_MODES,
    FIXED_MODES,
    addMonths,
    blankAgreement,
    buildSchedule,
    fixedModeOf,
    fixedTotal,
    normalizeAgreement,
    validateAgreement,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  globalThis.FinanceContracts = api;
})();
