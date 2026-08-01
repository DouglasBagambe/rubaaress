export type EnrolmentRow = {
  className: string;
  femaleDay: number;
  femaleBoarding: number;
  maleDay: number;
  maleBoarding: number;
  total: number;
};

export type EnrolmentTotals = {
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

export const enrolmentRows: ReadonlyArray<EnrolmentRow> = [
  { className: "S.1", femaleDay: 59, femaleBoarding: 110, maleDay: 43, maleBoarding: 71, total: 283 },
  { className: "S.2", femaleDay: 43, femaleBoarding: 108, maleDay: 46, maleBoarding: 63, total: 260 },
  { className: "S.3", femaleDay: 35, femaleBoarding: 100, maleDay: 46, maleBoarding: 63, total: 244 },
  { className: "S.4", femaleDay: 10, femaleBoarding: 154, maleDay: 26, maleBoarding: 83, total: 273 },
  { className: "S.5", femaleDay: 5, femaleBoarding: 106, maleDay: 14, maleBoarding: 77, total: 202 },
  { className: "S.6", femaleDay: 2, femaleBoarding: 69, maleDay: 12, maleBoarding: 65, total: 148 },
] as const;

export const enrolmentReportingDate = "16 March 2026";

export const enrolmentTotals = calculateEnrolment(enrolmentRows).totals satisfies EnrolmentTotals;
import { calculateEnrolment } from "@/lib/enrolment";
