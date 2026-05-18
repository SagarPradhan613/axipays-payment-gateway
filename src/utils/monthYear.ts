const MONTHS_IN_YEAR = 12;

export interface MonthOption {
  value: string;
  label: string;
}

export interface ParsedMonthYearInput {
  month: string;
  year: string;
  isComplete: boolean;
  isValid: boolean;
}

// Stored expiry values live as separate fields, but the picker and summary UI both want the
// familiar combined label users expect to see on payment forms.
export const formatMonthYearValue = (month?: string, year?: string) => {
  if (!month || !year) {
    return '';
  }

  return `${month} / ${year}`;
};

// People type expiry dates in a few different ways, so we accept the short and long year forms
// here and hand the rest of the app one normalized shape to validate.
export const parseMonthYearInput = (input: string) => {
  const digits = input.replace(/\D/g, '').slice(0, 6);
  const month = digits.slice(0, 2);
  const rawYear = digits.slice(2);
  const normalizedYear =
    rawYear.length === 2 ? `20${rawYear}` : rawYear.length === 4 ? rawYear : '';
  const monthNumber = Number(month);
  const isValidMonth = month.length === 2 && monthNumber >= 1 && monthNumber <= 12;
  const isComplete = month.length === 2 && (rawYear.length === 2 || rawYear.length === 4);

  return {
    month,
    year: normalizedYear,
    isComplete,
    isValid: isValidMonth && normalizedYear.length === 4,
  };
};

// Month labels come from Intl so the dropdown can follow the active locale without maintaining
// our own translation table for abbreviations.
export const getMonthOptions = (locale: string) =>
  Array.from({ length: MONTHS_IN_YEAR }, (_, index) => {
    const value = String(index + 1).padStart(2, '0');
    const date = new Date(2026, index, 1);

    return {
      value,
      label: new Intl.DateTimeFormat(locale, { month: 'short' }).format(date),
    };
  });

// Picker pages are anchored to a stable base year so the year grid does not jump around when the
// selected value changes.
export const getYearPageStart = (year: number, yearsPerPage: number, baseYear = 0) =>
  baseYear + Math.floor((year - baseYear) / yearsPerPage) * yearsPerPage;
