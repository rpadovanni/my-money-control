import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { SavingsGoal, SavingsGoalFormData, GoalStatus, GoalType } from '../types';
import { GOAL_STATUSES, GOAL_TYPES } from '../types';
import { useSavingsGoals } from '../hooks';
import { formatCurrencyWhileTyping } from '../utils';

interface GoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: SavingsGoal;
}

export function GoalForm({ open, onOpenChange, goal }: GoalFormProps) {
  const { addGoal, updateGoal } = useSavingsGoals();

  const form = useForm<SavingsGoalFormData>({
    defaultValues: goal
      ? {
          name: goal.name,
          description: goal.description || '',
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          targetDate: goal.targetDate,
          startDate: goal.startDate,
          status: goal.status,
          type: goal.type,
          category: goal.category || '',
        }
      : {
          name: '',
          description: '',
          targetAmount: 0,
          currentAmount: 0,
          targetDate: undefined,
          startDate: new Date(),
          status: 'active',
          type: 'amount',
          category: '',
        },
    mode: 'onChange',
  });

  const onSubmit = (data: SavingsGoalFormData) => {
    if (goal) {
      updateGoal(goal.id, data);
    } else {
      addGoal(data);
    }
    form.reset();
    onOpenChange(false);
  };

  const statuses = Object.entries(GOAL_STATUSES) as [GoalStatus, string][];
  const types = Object.entries(GOAL_TYPES) as [GoalType, string][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{goal ? 'Editar Meta' : 'Nova Meta Financeira'}</DialogTitle>
          <DialogDescription>
            {goal ? 'Atualize as informações da meta.' : 'Crie uma nova meta financeira para acompanhar seu progresso.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Meta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Reserva de Emergência" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva sua meta financeira"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Alvo (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0,00"
                        value={
                          field.value && field.value > 0
                            ? formatCurrencyWhileTyping(
                                Math.round(field.value * 100).toString()
                              )
                            : ''
                        }
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numbers = inputValue.replace(/\D/g, '');
                          
                          if (!numbers) {
                            field.onChange(0);
                            return;
                          }
                          
                          const numericValue = parseInt(numbers, 10) / 100;
                          field.onChange(numericValue);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Atual (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0,00"
                        value={
                          field.value && field.value > 0
                            ? formatCurrencyWhileTyping(
                                Math.round(field.value * 100).toString()
                              )
                            : ''
                        }
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numbers = inputValue.replace(/\D/g, '');
                          
                          if (!numbers) {
                            field.onChange(0);
                            return;
                          }
                          
                          const numericValue = parseInt(numbers, 10) / 100;
                          field.onChange(numericValue);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {types.map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Alvo (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>Data prevista para alcançar a meta</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{goal ? 'Salvar' : 'Criar Meta'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

