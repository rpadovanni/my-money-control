import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettings } from '../hooks';
import { CURRENCY_FORMATS, DATE_FORMATS } from '../types';
import { Settings as SettingsIcon } from 'lucide-react';

export function ViewPreferences() {
  const { viewPreferences, updateViewPreferences } = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          Preferências de Visualização
        </CardTitle>
        <CardDescription>Configure como os dados são exibidos na aplicação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Formato de Moeda</Label>
          <Select
            value={viewPreferences.currencyFormat}
            onValueChange={(value) =>
              updateViewPreferences({ currencyFormat: value as typeof viewPreferences.currencyFormat })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CURRENCY_FORMATS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Formato de Data</Label>
          <Select
            value={viewPreferences.dateFormat}
            onValueChange={(value) =>
              updateViewPreferences({ dateFormat: value as typeof viewPreferences.dateFormat })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_FORMATS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showDecimals"
              checked={viewPreferences.showDecimals}
              onCheckedChange={(checked) =>
                updateViewPreferences({ showDecimals: checked === true })
              }
            />
            <Label htmlFor="showDecimals" className="cursor-pointer">
              Mostrar decimais nos valores
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="compactMode"
              checked={viewPreferences.compactMode}
              onCheckedChange={(checked) =>
                updateViewPreferences({ compactMode: checked === true })
              }
            />
            <Label htmlFor="compactMode" className="cursor-pointer">
              Modo compacto (menos espaçamento)
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

