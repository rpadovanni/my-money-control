import { useState } from 'react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useFixedCosts } from '../hooks';
import type { FixedCost, FixedCostFormData, FixedCostType, RenewalCycle } from '../types';
import { FIXED_COST_TYPES, RENEWAL_CYCLES } from '../types';
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
          name: fixedCost.name,
          amount: fixedCost.amount,
          type: fixedCost.type,
          dueDay: fixedCost.dueDay,
          renewalCycle: fixedCost.renewalCycle,
          active: fixedCost.active,
        }
      : {
          name: '',
          amount: 0,
          type: 'other',
          dueDay: 1,
          renewalCycle: 'monthly',
          active: true,
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

  const types = Object.entries(FIXED_COST_TYPES) as [FixedCostType, string][];
  const cycles = Object.entries(RENEWAL_CYCLES) as [RenewalCycle, string][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {fixedCost ? 'Editar Custo Fixo' : 'Novo Custo Fixo'}
          </DialogTitle>
          <DialogDescription>
            {fixedCost
              ? 'Atualize as informações do custo fixo.'
              : 'Registre um novo custo fixo (aluguel, saúde, assinaturas, etc.).'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aluguel, Netflix, Plano de Saúde..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                name="renewalCycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodicidade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cycles.map(([value, label]) => (
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Valor ({form.watch('renewalCycle') === 'yearly' ? 'Anual' : 'Mensal'}) (R$)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0,00"
                        value={
                          field.value && field.value > 0
                            ? formatCurrencyWhileTyping(Math.round(field.value * 100).toString())
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
                name="dueDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Vencimento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10) || 1;
                          field.onChange(Math.max(1, Math.min(31, value)));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Desative para ocultar sem deletar
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
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
