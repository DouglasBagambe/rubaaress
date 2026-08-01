import { defineQuery } from "next-sanity";

export type EnrolmentQueryResult = ReadonlyArray<{
  _id: string;
  academicYear?: string;
  reportingDate?: string;
  status?: "draft" | "current" | "archived";
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
  classRows[]{
    className,
    femaleDay,
    femaleBoarding,
    maleDay,
    maleBoarding
  }
}`);
