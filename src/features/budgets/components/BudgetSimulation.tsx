import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBudgets } from '../hooks';
import { formatCurrency, getCurrentMonth } from '../utils';
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { BudgetChart } from './BudgetChart';

export function BudgetSimulation() {
  const { getBudgetSimulation } = useBudgets();
  const { month, year } = getCurrentMonth();
  
  const [simulationMonth, setSimulationMonth] = useState(month);
  const [simulationYear, setSimulationYear] = useState(year);
  
  const simulation = getBudgetSimulation(simulationMonth, simulationYear);

  const handleMonthChange = (value: number) => {
    if (value >= 1 && value <= 12) {
      setSimulationMonth(value);
    }
  };

  const handleYearChange = (value: number) => {
    if (value >= 2020 && value <= 2100) {
      setSimulationYear(value);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Simulação de Orçamento
          </CardTitle>
          <CardDescription>
            Visualize a projeção de gastos para um mês específico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mês</Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={simulationMonth}
                onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
              />
            </div>
            <div className="space-y-2">
              <Label>Ano</Label>
              <Input
                type="number"
                min="2020"
                max="2100"
                value={simulationYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
              />
            </div>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Limite Total</p>
                <p className="text-lg font-bold">{formatCurrency(simulation.totalLimit)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gastos Projetados</p>
                <p className={`text-lg font-bold ${simulation.isExceeded ? 'text-destructive' : ''}`}>
                  {formatCurrency(simulation.projectedSpending)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Restante</p>
                <p className={`text-lg font-bold ${simulation.remaining < 0 ? 'text-destructive' : 'text-green-600'}`}>
                  {formatCurrency(simulation.remaining)}
                </p>
              </div>
            </div>
          </div>
          {simulation.isExceeded && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
              <p className="text-sm font-medium text-destructive">
                ⚠️ Atenção: O orçamento está excedido em {formatCurrency(Math.abs(simulation.remaining))}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <BudgetChart />
    </div>
  );
}

