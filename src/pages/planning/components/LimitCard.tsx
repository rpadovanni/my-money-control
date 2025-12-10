import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/shared/store';

export function LimitCard() {
  const totalLimits = useStore((state) => state.getTotalLimits());
  const remaining = useStore((state) => state.getRemaining());
  const usedPercentage = useStore((state) => state.getUsedPercentage());
  const monthlyIncome = useStore((state) => state.planning.monthlyIncome);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Limites de Categoria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Planejado</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalLimits)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Saldo Restante</p>
            <p
              className={`text-2xl font-bold ${
                remaining < 0 ? 'text-destructive' : 'text-green-600'
              }`}
            >
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(remaining)}
            </p>
          </div>
        </div>
        {monthlyIncome > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Porcentagem Utilizada
            </p>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  usedPercentage > 100
                    ? 'bg-destructive'
                    : usedPercentage > 80
                    ? 'bg-yellow-500'
                    : 'bg-primary'
                }`}
                style={{ width: `${Math.min(usedPercentage, 100)}%` }}
              />
            </div>
            <p className="text-sm mt-1">{usedPercentage.toFixed(1)}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

