import { useEffect } from 'react';
import { useStore } from '../../../shared/store';
import { initializeTheme } from '../utils';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state?.settings?.theme ?? 'system');

  useEffect(() => {
    if (theme) {
      initializeTheme(theme);
    }
  }, [theme]);

  return <>{children}</>;
}

