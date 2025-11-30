import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpenses } from '../hooks';
import { formatCurrency } from '../utils';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../types';

export function ExpensesSummary() {
  const { totalExpenses, expensesByCategory, expensesByPaymentMethod } = useExpenses();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Total de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Por Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(expensesByPaymentMethod).map(([method, amount]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {PAYMENT_METHODS[method as keyof typeof PAYMENT_METHODS]}
                </span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
            ))}
            {Object.keys(expensesByPaymentMethod).length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma despesa registrada</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]}
                  </span>
                  <span className="font-semibold">{formatCurrency(amount)}</span>
                </div>
              ))}
            {Object.keys(expensesByCategory).length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma despesa registrada</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

