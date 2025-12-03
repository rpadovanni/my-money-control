import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSavingsGoals } from '../hooks';
import { formatCurrency, formatDate, calculateGoalProgress } from '../utils';
import { GoalForm } from './GoalForm';
import { useState } from 'react';
import type { SavingsGoal } from '../types';
import { GOAL_STATUSES, GOAL_TYPES } from '../types';
import { Trash2, Edit, Plus, TrendingUp } from 'lucide-react';

export function GoalsTable() {
  const { savingsGoals, deleteGoal } = useSavingsGoals();
  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | undefined>();

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingGoal(undefined);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Metas Financeiras</CardTitle>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </CardHeader>
      <CardContent>
        {savingsGoals.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma meta criada. Clique em "Nova Meta" para criar sua primeira meta financeira.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meta</TableHead>
                <TableHead>Valor Alvo</TableHead>
                <TableHead>Valor Atual</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Alvo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savingsGoals.map((goal) => {
                const progress = calculateGoalProgress(goal);
                return (
                  <TableRow key={goal.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{goal.name}</div>
                        {goal.description && (
                          <div className="text-sm text-muted-foreground">{goal.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(goal.targetAmount)}</TableCell>
                    <TableCell>{formatCurrency(goal.currentAmount)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{progress.percentage.toFixed(1)}%</span>
                          <span className="text-muted-foreground">
                            {formatCurrency(progress.remainingAmount)} restante
                          </span>
                        </div>
                        <Progress value={Math.min(progress.percentage, 100)} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          goal.status === 'completed'
                            ? 'default'
                            : goal.status === 'active'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {GOAL_STATUSES[goal.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {goal.targetDate ? formatDate(goal.targetDate) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <GoalForm open={formOpen} onOpenChange={setFormOpen} goal={editingGoal} />
    </Card>
  );
}

