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
import { useBudget } from '../hooks';
import type { CategoryBudget, CategoryBudgetFormData, BudgetCategory } from '../types';
import { TRANSACTION_CATEGORIES, EXPENSE_CATEGORIES } from '../../transactions/types';
import { formatCurrencyWhileTyping } from '../utils';

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: CategoryBudget;
}

export function BudgetForm({ open, onOpenChange, budget }: BudgetFormProps) {
  const { addBudget, updateBudget } = useBudget();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const form = useForm<CategoryBudgetFormData>({
    defaultValues: budget
      ? {
          category: budget.category,
          limit: budget.limit,
          month: budget.month,
          year: budget.year,
        }
      : {
          category: 'food',
          limit: 0,
          month: currentMonth,
          year: currentYear,
        },
    mode: 'onChange',
  });

  const onSubmit = (data: CategoryBudgetFormData) => {
    if (budget) {
      updateBudget(budget.id, data);
    } else {
      addBudget(data);
    }
    form.reset();
    onOpenChange(false);
  };

  // Filter only expense categories
  const categories = EXPENSE_CATEGORIES.map((cat) => ({
    value: cat,
    label: TRANSACTION_CATEGORIES[cat],
  })) as Array<{ value: BudgetCategory; label: string }>;

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  // Generate year options (current year and next year)
  const years = [currentYear, currentYear + 1];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {budget ? 'Editar Orçamento' : 'Novo Orçamento por Categoria'}
          </DialogTitle>
          <DialogDescription>
            {budget
              ? 'Atualize o limite de orçamento para esta categoria.'
              : 'Configure o limite de orçamento mensal para uma categoria.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite Mensal (R$)</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month.toString()}>
                            {monthNames[month - 1]}
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
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{budget ? 'Salvar' : 'Adicionar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

