import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '../hooks';
import { THEMES } from '../types';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeSettings() {
  const { theme, updateTheme } = useSettings();

  const themes = [
    { value: 'light' as const, label: THEMES.light, icon: Sun, description: 'Tema claro' },
    { value: 'dark' as const, label: THEMES.dark, icon: Moon, description: 'Tema escuro' },
    { value: 'system' as const, label: THEMES.system, icon: Monitor, description: 'Seguir preferência do sistema' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tema</CardTitle>
        <CardDescription>Escolha o tema de visualização da aplicação</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.value;
            return (
              <Button
                key={themeOption.value}
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  'w-full justify-start h-auto p-4',
                  isSelected && 'bg-primary text-primary-foreground'
                )}
                onClick={() => updateTheme(themeOption.value)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="h-5 w-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{themeOption.label}</div>
                    <div className={cn('text-sm', isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                      {themeOption.description}
                    </div>
                  </div>
                  {isSelected && <Check className="h-5 w-5" />}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
