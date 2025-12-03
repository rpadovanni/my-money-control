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
import type { CategoryBudget, CategoryBudgetFormData, ExpenseCategory } from '../types';
import { TRANSACTION_CATEGORIES, EXPENSE_CATEGORIES } from '../../features-new/transactions/types';
import { useBudgets } from '../hooks';
import { formatCurrencyWhileTyping, getCurrentMonth } from '../utils';

interface CategoryBudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: CategoryBudget;
}

export function CategoryBudgetForm({ open, onOpenChange, budget }: CategoryBudgetFormProps) {
  const { addCategoryBudget, updateCategoryBudget } = useBudgets();
  const { month, year } = getCurrentMonth();

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
          month,
          year,
        },
    mode: 'onChange',
  });

  const onSubmit = (data: CategoryBudgetFormData) => {
    if (budget) {
      updateCategoryBudget(budget.id, data);
    } else {
      addCategoryBudget(data);
    }
    form.reset();
    onOpenChange(false);
  };

  // Filter only expense categories (not income categories)
  const expenseCategories = EXPENSE_CATEGORIES.map(cat => [cat, TRANSACTION_CATEGORIES[cat]] as [ExpenseCategory, string]);
  const categories = expenseCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{budget ? 'Editar Orçamento' : 'Novo Orçamento por Categoria'}</DialogTitle>
          <DialogDescription>
            {budget ? 'Atualize o limite de orçamento para esta categoria.' : 'Configure o limite de orçamento mensal para uma categoria.'}
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
                      {categories.map(([value, label]) => (
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="12"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value >= 1 && value <= 12) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
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
                    <FormControl>
                      <Input
                        type="number"
                        min="2020"
                        max="2100"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value >= 2020 && value <= 2100) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
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

