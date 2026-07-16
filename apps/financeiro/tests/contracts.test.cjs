const test = require("node:test");
const assert = require("node:assert/strict");
const {
  addMonths,
  buildSchedule,
  fixedTotal,
  normalizeAgreement,
} = require("../assets/contracts.js");

test("gerar entrada e quatro parcelas mensais sem alterar o total", () => {
  const schedule = buildSchedule({
    mode: "installments",
    totalAmount: 5000,
    downPaymentAmount: 1000,
    downPaymentDueDate: "2026-01-10",
    installmentCount: 4,
    firstInstallmentDueDate: "2026-02-10",
  });

  assert.deepEqual(
    schedule.map((item) => item.amount),
    [1000, 1000, 1000, 1000, 1000],
  );
  assert.deepEqual(
    schedule.map((item) => item.dueDate),
    ["2026-01-10", "2026-02-10", "2026-03-10", "2026-04-10", "2026-05-10"],
  );
  assert.equal(
    fixedTotal({
      mode: "installments",
      totalAmount: 5000,
      downPaymentAmount: 1000,
      downPaymentDueDate: "2026-01-10",
      installmentCount: 4,
      firstInstallmentDueDate: "2026-02-10",
    }),
    5000,
  );
});

test("preservar o dia mensal e ajustar apenas meses mais curtos", () => {
  assert.equal(addMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(addMonths("2026-01-31", 2), "2026-03-31");
});

test("distribuir centavos entre parcelas sem divergência", () => {
  const schedule = buildSchedule({
    mode: "installments",
    totalAmount: 100,
    downPaymentAmount: "",
    installmentCount: 3,
    firstInstallmentDueDate: "2026-01-05",
  });

  assert.deepEqual(
    schedule.map((item) => item.amount),
    [33.34, 33.33, 33.33],
  );
  assert.equal(
    schedule.reduce((sum, item) => sum + item.amount, 0),
    100,
  );
});

test("deixar campos novos vazios e ignorar propriedades antigas", () => {
  const agreement = normalizeAgreement({ feeAmount: 5000 });

  assert.equal(agreement.mode, "");
  assert.equal(agreement.totalAmount, "");
  assert.equal(agreement.successRate, "");
  assert.deepEqual(agreement.stages, []);
});

test("somar etapas e manter êxito separado na contratação mista", () => {
  const agreement = {
    mode: "mixed",
    fixedMode: "stages",
    stages: [
      {
        id: "initial",
        description: "Protocolo",
        amount: 1500,
        dueDate: "2026-01-15",
      },
      {
        id: "hearing",
        description: "Audiência",
        amount: 2500,
        dueDate: "2026-03-20",
      },
    ],
    successRate: 15,
  };

  assert.equal(fixedTotal(agreement), 4000);
  assert.equal(buildSchedule(agreement).length, 2);
});
