import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSavingsGoals } from '../hooks';
import { formatCurrency, calculateGoalProgress } from '../utils';
import { Target, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

export function GoalProgressCard() {
  const { activeGoals, overallProgress, goalsOnTrack, goalsOffTrack } = useSavingsGoals();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Alvo</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(overallProgress.totalTarget)}</div>
          <CardDescription className="mt-1">
            {activeGoals.length} meta{activeGoals.length !== 1 ? 's' : ''} ativa{activeGoals.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Arrecadado</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(overallProgress.totalCurrent)}
          </div>
          <CardDescription className="mt-1">
            {overallProgress.percentage.toFixed(1)}% do total
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">No Prazo</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{goalsOnTrack.length}</div>
          <CardDescription className="mt-1">Metas no caminho certo</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atenção</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{goalsOffTrack.length}</div>
          <CardDescription className="mt-1">Metas precisando de atenção</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

