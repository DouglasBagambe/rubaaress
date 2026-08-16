import { defineQuery } from "next-sanity";

export type EnrolmentQueryResult = ReadonlyArray<{
  _id: string;
  academicYear?: string;
  reportingDate?: string;
  status?: "draft" | "current" | "archived";
  headline?: {
    grandTotal?: number;
    totalFemale?: number;
    totalMale?: number;
    totalBoarding?: number;
    totalDay?: number;
  };
  detailedRows?: ReadonlyArray<{ className?: string; stream?: string; male?: number; female?: number; total?: number }>;
  boardingDayRows?: ReadonlyArray<{ className?: string; boarderBoys?: number; boarderGirls?: number; boarderTotal?: number; dayBoys?: number; dayGirls?: number; dayTotal?: number }>;
  classRows?: ReadonlyArray<{
    className?: string;
    femaleDay?: number;
    femaleBoarding?: number;
    maleDay?: number;
    maleBoarding?: number;
  }>;
}> | null;

export const CURRENT_ENROLMENT_QUERY = defineQuery(`*[_type == "enrolment" && status == "current"] | order(reportingDate desc){
  _id,
  academicYear,
  reportingDate,
  status,
  headline,
  detailedRows[]{className, stream, male, female, total},
  boardingDayRows[]{className, boarderBoys, boarderGirls, boarderTotal, dayBoys, dayGirls, dayTotal},
  classRows[]{
    className,
    femaleDay,
    femaleBoarding,
    maleDay,
    maleBoarding
  }
}`);
