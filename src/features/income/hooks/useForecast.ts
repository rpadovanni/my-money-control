import { useAtomValue } from 'jotai';
import { currentMonthForecastAtom, nextMonthForecastAtom } from '../atoms';

export function useForecast() {
  const currentMonthForecast = useAtomValue(currentMonthForecastAtom);
  const nextMonthForecast = useAtomValue(nextMonthForecastAtom);

  return {
    currentMonthForecast,
    nextMonthForecast,
  };
}

