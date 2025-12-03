import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useChecklist } from '../hooks/useChecklist';

export function WeeklyChecklist() {
  const { weeklyChecklist, toggleWeeklyItem, resetWeeklyChecklist, weeklyProgress } = useChecklist();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Checklist Semanal</CardTitle>
            <CardDescription>Itens recorrentes para revisar toda semana</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetWeeklyChecklist}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">
              {Math.round(weeklyProgress)}%
            </span>
          </div>
          <Progress value={weeklyProgress} />
        </div>
        <div className="space-y-3">
          {weeklyChecklist.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={() => toggleWeeklyItem(item.id)}
              />
              <label
                htmlFor={item.id}
                className={`text-sm font-medium leading-none cursor-pointer flex-1 ${
                  item.checked ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

