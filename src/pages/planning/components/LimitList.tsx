import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/shared/store';
import { Pencil, Trash2 } from 'lucide-react';

interface LimitListProps {
  onEdit: (id: string) => void;
}

export function LimitList({ onEdit }: LimitListProps) {
  const limits = useStore((state) => state.planning.limits);
  const removeLimit = useStore((state) => state.removeLimit);
  const monthlyIncome = useStore((state) => state.planning.monthlyIncome);

  if (limits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Limites por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhum limite cadastrado. Clique em "Adicionar limite" para começar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Limites por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {limits.map((limit) => {
            const percentage =
              monthlyIncome > 0
                ? ((limit.amount / monthlyIncome) * 100).toFixed(1)
                : '0.0';
            return (
              <div
                key={limit.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{limit.category}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(limit.amount)}{' '}
                    {monthlyIncome > 0 && `(${percentage}%)`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(limit.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLimit(limit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

