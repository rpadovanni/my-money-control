import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChecklistItemComponent } from './ChecklistItem';
import { useChecklist } from '../hooks';
import type { ChecklistItem } from '../types';

interface ChecklistCardProps {
  title: string;
  description: string;
  items: Array<ChecklistItem & { completed: boolean; completedAt?: string }>;
  progress: { completed: number; total: number; percentage: number };
  period: 'weekly' | 'monthly';
}

export function ChecklistCard({ title, description, items, progress, period }: ChecklistCardProps) {
  const { toggleItem } = useChecklist();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant={progress.percentage === 100 ? 'default' : 'secondary'}>
            {progress.completed}/{progress.total}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{progress.percentage.toFixed(0)}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <ChecklistItemComponent
              key={item.id}
              item={item}
              onToggle={() => toggleItem(item.id, period)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

