import { useAtom } from 'jotai';
import { settingsAtom } from './atoms';
import { themeAtom } from './selectors';
import type { Settings } from './types';

export function useSettings() {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [theme, setTheme] = useAtom(themeAtom);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    theme,
    setTheme,
    updateSettings,
  };
}

