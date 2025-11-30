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
import type { Expense, ExpenseFormData, ExpenseCategory, PaymentMethod } from '../types';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../types';
import { useExpenses } from '../hooks';
import { parseCurrencyFormatted, formatCurrencyWhileTyping } from '../utils';

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense;
}

export function ExpenseForm({ open, onOpenChange, expense }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenses();

  const form = useForm<ExpenseFormData>({
    defaultValues: expense
      ? {
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          paymentMethod: expense.paymentMethod,
          date: expense.date.toISOString().split('T')[0],
        }
      : {
          description: '',
          amount: 0,
          category: 'other',
          paymentMethod: 'pix',
          date: new Date().toISOString().split('T')[0],
        },
    mode: 'onChange',
  });

  const onSubmit = (data: ExpenseFormData) => {
    const expenseData = {
      ...data,
      date: new Date(data.date),
    };
    if (expense) {
      updateExpense(expense.id, expenseData);
    } else {
      addExpense(expenseData);
    }
    form.reset();
    onOpenChange(false);
  };

  const categories = Object.entries(EXPENSE_CATEGORIES) as [ExpenseCategory, string][];
  const paymentMethods = Object.entries(PAYMENT_METHODS) as [PaymentMethod, string][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? 'Editar Despesa' : 'Nova Despesa'}</DialogTitle>
          <DialogDescription>
            {expense ? 'Atualize as informações da despesa.' : 'Registre uma nova despesa direta.'}
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
                    <Input placeholder="Ex: Supermercado" {...field} />
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
                    <FormLabel>Valor (R$)</FormLabel>
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
                          // Remove tudo exceto números
                          const numbers = inputValue.replace(/\D/g, '');
                          
                          if (!numbers) {
                            field.onChange(0);
                            return;
                          }
                          
                          // Formata enquanto digita
                          const formatted = formatCurrencyWhileTyping(numbers);
                          // Converte para número (divide por 100 porque os números são centavos)
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a forma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethods.map(([value, label]) => (
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{expense ? 'Salvar' : 'Adicionar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

