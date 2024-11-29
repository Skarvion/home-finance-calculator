import { Frequency } from "./data";

export function formatMonthsToStr(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} months`;
  }

  if (remainingMonths === 0) {
    return `${years} years`;
  }

  return `${years} years ${remainingMonths} months`;
}

export function isTermFirstInAYear(
  term: number,
  frequency: Frequency
): boolean {
  if (frequency === "yearly") {
    return true;
  } else if (frequency === "monthly") {
    return term % 12 === 0;
  } else if (frequency === "fortnightly" || frequency === "weekly") {
    const multiplier = 365 / (frequency === "fortnightly" ? 14 : 7);
    return Math.floor(term % multiplier) === 0;
  } else {
    throw new Error("Invalid frequency");
  }
}
