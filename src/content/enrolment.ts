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
  { className: "S.1", femaleDay: 59, femaleBoarding: 105, maleDay: 43, maleBoarding: 69, total: 276 },
  { className: "S.2", femaleDay: 45, femaleBoarding: 104, maleDay: 46, maleBoarding: 68, total: 263 },
  { className: "S.3", femaleDay: 34, femaleBoarding: 98, maleDay: 49, maleBoarding: 66, total: 247 },
  { className: "S.4", femaleDay: 10, femaleBoarding: 156, maleDay: 26, maleBoarding: 87, total: 279 },
  { className: "S.5", femaleDay: 6, femaleBoarding: 105, maleDay: 19, maleBoarding: 77, total: 207 },
  { className: "S.6", femaleDay: 3, femaleBoarding: 69, maleDay: 12, maleBoarding: 62, total: 146 },
] as const;

export const enrolmentReportingDate = verifiedEnrolment.reportingDateLabel;

export const enrolmentTotals: EnrolmentTotals = {
  femaleDay: verifiedEnrolment.boardingDayTotals.dayGirls,
  femaleBoarding: verifiedEnrolment.boardingDayTotals.boarderGirls,
  totalFemale: verifiedEnrolment.headline.totalFemale,
  maleDay: verifiedEnrolment.boardingDayTotals.dayBoys,
  maleBoarding: verifiedEnrolment.boardingDayTotals.boarderBoys,
  totalMale: verifiedEnrolment.headline.totalMale,
  totalDay: verifiedEnrolment.headline.totalDay,
  totalBoarding: verifiedEnrolment.headline.totalBoarding,
  grandTotal: verifiedEnrolment.headline.grandTotal,
};
import { verifiedEnrolment } from "@/content/verified-school-content";
