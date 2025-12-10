import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useStore } from '@/shared/store';

export function IncomeCard() {
  const monthlyIncome = useStore((state) => state.planning.monthlyIncome);
  const setMonthlyIncome = useStore((state) => state.setMonthlyIncome);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Renda Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="0.00"
            value={monthlyIncome || ''}
            onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
            className="text-2xl font-bold"
          />
        </div>
      </CardContent>
    </Card>
  );
}

