export type EnrolmentInputRow = {
  className: string;
  femaleDay?: number | null;
  femaleBoarding?: number | null;
  maleDay?: number | null;
  maleBoarding?: number | null;
};

export type CalculatedEnrolmentRow = {
  className: string;
  femaleDay: number;
  femaleBoarding: number;
  maleDay: number;
  maleBoarding: number;
  total: number;
};

export type CalculatedEnrolmentTotals = {
  femaleDay: number;
  femaleBoarding: number;
  totalFemale: number;
  maleDay: number;
  maleBoarding: number;
  totalMale: number;
  totalDay: number;
  totalBoarding: number;
  grandTotal: number;
};

export type CalculatedEnrolment = {
  rows: ReadonlyArray<CalculatedEnrolmentRow>;
  totals: CalculatedEnrolmentTotals;
  warnings: ReadonlyArray<string>;
};

function normaliseNumber(value: number | null | undefined, label: string, warnings: string[]) {
  if (value === null || value === undefined) return 0;
  if (!Number.isInteger(value) || value < 0) {
    warnings.push(`${label} must be a non-negative integer.`);
    return 0;
  }
  return value;
}

export function calculateEnrolment(rows: ReadonlyArray<EnrolmentInputRow>): CalculatedEnrolment {
  const warnings: string[] = [];
  const seenClasses = new Set<string>();

  const calculatedRows = rows.map((row) => {
    const className = row.className.trim();
    if (!className) warnings.push("A class row is missing a class name.");
    if (seenClasses.has(className)) warnings.push(`Duplicate class name: ${className}.`);
    seenClasses.add(className);

    const femaleDay = normaliseNumber(row.femaleDay, `${className} female day`, warnings);
    const femaleBoarding = normaliseNumber(row.femaleBoarding, `${className} female boarding`, warnings);
    const maleDay = normaliseNumber(row.maleDay, `${className} male day`, warnings);
    const maleBoarding = normaliseNumber(row.maleBoarding, `${className} male boarding`, warnings);

    return {
      className,
      femaleDay,
      femaleBoarding,
      maleDay,
      maleBoarding,
      total: femaleDay + femaleBoarding + maleDay + maleBoarding,
    };
  });

  const totals = calculatedRows.reduce<CalculatedEnrolmentTotals>(
    (acc, row) => ({
      femaleDay: acc.femaleDay + row.femaleDay,
      femaleBoarding: acc.femaleBoarding + row.femaleBoarding,
      totalFemale: acc.totalFemale + row.femaleDay + row.femaleBoarding,
      maleDay: acc.maleDay + row.maleDay,
      maleBoarding: acc.maleBoarding + row.maleBoarding,
      totalMale: acc.totalMale + row.maleDay + row.maleBoarding,
      totalDay: acc.totalDay + row.femaleDay + row.maleDay,
      totalBoarding: acc.totalBoarding + row.femaleBoarding + row.maleBoarding,
      grandTotal: acc.grandTotal + row.total,
    }),
    {
      femaleDay: 0,
      femaleBoarding: 0,
      totalFemale: 0,
      maleDay: 0,
      maleBoarding: 0,
      totalMale: 0,
      totalDay: 0,
      totalBoarding: 0,
      grandTotal: 0,
    },
  );

  return { rows: calculatedRows, totals, warnings };
}
