import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { themeAtom } from '../atoms';
import { initializeTheme } from '../utils';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    initializeTheme(theme);
  }, [theme]);

  return <>{children}</>;
}

