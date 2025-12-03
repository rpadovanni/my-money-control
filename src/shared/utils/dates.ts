// Shared date utilities

export function getCurrentMonth() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

export function getMonthStart(month?: number, year?: number): Date {
  const now = new Date();
  const m = month || now.getMonth() + 1;
  const y = year || now.getFullYear();
  return new Date(y, m - 1, 1);
}

export function getMonthEnd(month?: number, year?: number): Date {
  const now = new Date();
  const m = month || now.getMonth() + 1;
  const y = year || now.getFullYear();
  return new Date(y, m, 0, 23, 59, 59);
}

