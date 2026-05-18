// Keep currency formatting in one place so cards, tables, and charts stay in sync
// when locale or currency rules change.
export const formatCurrencyAmount = (
  amount: number,
  currency: string,
  locale = 'en-US',
) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

// The dashboard API already stores month and year separately, so this helper only handles
// the display shape we want in tables and summaries.
export const formatExpiryDisplay = (month: string | number, year: string | number) => {
  const normalizedMonth = String(month).padStart(2, '0');
  return `${normalizedMonth} / ${year}`;
};

// Phone numbers are normalized before validation and persistence so users can paste
// formatted values without polluting the stored payload.
export const formatPhone = (value: string) => value.replace(/[^\d+]/g, '');
