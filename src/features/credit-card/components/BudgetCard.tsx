import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBudget } from '../hooks';
import { formatCurrency } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Save } from 'lucide-react';

export function BudgetCard() {
  const { currentBudget, budgetRemaining, setBudget } = useBudget();
  const [editing, setEditing] = useState(false);
  const [limit, setLimit] = useState(currentBudget?.limit.toString() || '0');

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const handleSave = () => {
    setBudget({
      month: currentMonth,
      year: currentYear,
      limit: Number(limit),
      spent: currentBudget?.spent || 0,
    });
    setEditing(false);
  };

  const percentage = currentBudget
    ? Math.min((currentBudget.spent / currentBudget.limit) * 100, 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçamento Mensal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Limite Mensal (R$)</label>
              <Input
                type="number"
                step="0.01"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <>
            {currentBudget ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gasto:</span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(currentBudget.spent)} / {formatCurrency(currentBudget.limit)}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Restante:</span>
                  <span
                    className={`text-lg font-semibold ${
                      budgetRemaining < 0 ? 'text-destructive' : 'text-green-600'
                    }`}
                  >
                    {formatCurrency(budgetRemaining)}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="w-full">
                  Editar Orçamento
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure um orçamento mensal para controlar seus gastos.
                </p>
                <Button onClick={() => setEditing(true)} size="sm" className="w-full">
                  Definir Orçamento
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

