import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { ChecklistItem } from '../types';

interface ChecklistItemProps {
  item: ChecklistItem & { completed: boolean; completedAt?: string };
  onToggle: () => void;
}

export function ChecklistItemComponent({ item, onToggle }: ChecklistItemProps) {
  return (
    <Card className={item.completed ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id={item.id}
            checked={item.completed}
            onCheckedChange={onToggle}
            className="mt-1"
          />
          <div className="flex-1 space-y-1">
            <Label
              htmlFor={item.id}
              className={`text-sm font-medium leading-none cursor-pointer ${
                item.completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {item.title}
            </Label>
            <p className="text-xs text-muted-foreground">{item.description}</p>
            {item.completed && item.completedAt && (
              <p className="text-xs text-muted-foreground italic">
                Concluído em {new Date(item.completedAt).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

