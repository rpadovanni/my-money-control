// Shared hook to get current month
import { useMemo } from 'react';

export function useCurrentMonth() {
  return useMemo(() => {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  }, []);
}

