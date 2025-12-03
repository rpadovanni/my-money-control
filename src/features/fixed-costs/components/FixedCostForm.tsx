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
import { Checkbox } from '@/components/ui/checkbox';
import type { FixedCost, FixedCostFormData, FixedCostType } from '../types';
import { FIXED_COST_TYPES } from '../types';
import { useFixedCosts } from '../hooks';
import { formatCurrencyWhileTyping } from '../utils';

interface FixedCostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixedCost?: FixedCost;
}

export function FixedCostForm({ open, onOpenChange, fixedCost }: FixedCostFormProps) {
  const { addFixedCost, updateFixedCost } = useFixedCosts();

  const form = useForm<FixedCostFormData>({
    defaultValues: fixedCost
      ? {
          description: fixedCost.description,
          amount: fixedCost.amount,
          type: fixedCost.type,
          dueDay: fixedCost.dueDay,
          active: fixedCost.active,
          notes: fixedCost.notes || '',
        }
      : {
          description: '',
          amount: 0,
          type: 'housing',
          dueDay: 1,
          active: true,
          notes: '',
        },
    mode: 'onChange',
  });

  const onSubmit = (data: FixedCostFormData) => {
    if (fixedCost) {
      updateFixedCost(fixedCost.id, data);
    } else {
      addFixedCost(data);
    }
    form.reset();
    onOpenChange(false);
  };

  const costTypes = Object.entries(FIXED_COST_TYPES) as [FixedCostType, string][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{fixedCost ? 'Editar Custo Fixo' : 'Novo Custo Fixo'}</DialogTitle>
          <DialogDescription>
            {fixedCost ? 'Atualize as informações do custo fixo.' : 'Registre um novo custo fixo mensal.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aluguel, Plano de Saúde" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mensal (R$)</FormLabel>
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
                          
                          const formatted = formatCurrencyWhileTyping(numbers);
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
                        {costTypes.map(([value, label]) => (
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
                name="dueDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Vencimento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="1-31"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value >= 1 && value <= 31) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Dia do mês em que o custo vence</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Ativo</FormLabel>
                      <FormDescription>Custo fixo está ativo e deve ser considerado no orçamento</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre este custo fixo"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{fixedCost ? 'Salvar' : 'Adicionar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

