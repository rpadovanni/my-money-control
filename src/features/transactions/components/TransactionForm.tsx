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
import { Textarea } from '@/components/ui/textarea';
import type {
  Transaction,
  TransactionFormData,
  TransactionType,
  TransactionCategory,
} from '@/shared/store/types/transactions';
import {
  TRANSACTION_CATEGORIES,
  PAYMENT_METHODS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/shared/store/types/transactions';
import { useTransactions } from '../hooks';
import { formatCurrencyWhileTyping } from '../utils';
import { useCreditCards } from '../../credit-card/hooks';

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  defaultType?: TransactionType;
}

export function TransactionForm({ open, onOpenChange, transaction, defaultType }: TransactionFormProps) {
  const { addTransaction, updateTransaction } = useTransactions();
  const { activeCards } = useCreditCards();

  const form = useForm<TransactionFormData>({
    defaultValues: transaction
      ? {
          date: transaction.date,
          category: transaction.category,
          value: transaction.value,
          type: transaction.type,
          paymentMethod: transaction.paymentMethod,
          creditCardId: transaction.creditCardId,
          notes: transaction.notes,
        }
      : {
          date: new Date().toISOString().split('T')[0],
          category: defaultType === 'income' ? 'salary' : 'food',
          value: 0,
          type: defaultType || 'expense',
          paymentMethod: undefined,
          creditCardId: undefined,
          notes: '',
        },
    mode: 'onChange',
  });

  const transactionType = form.watch('type');
  const paymentMethod = form.watch('paymentMethod');

  const onSubmit = (data: TransactionFormData) => {
    if (transaction) {
      updateTransaction(transaction.id, data);
    } else {
      addTransaction(data);
    }
    form.reset();
    onOpenChange(false);
  };

  // Get categories based on type
  const availableCategories: TransactionCategory[] =
    transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const categoryOptions = availableCategories.map((cat) => ({
    value: cat,
    label: TRANSACTION_CATEGORIES[cat],
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {transaction
              ? `Editar ${transactionType === 'income' ? 'Receita' : 'Despesa'}`
              : `Nova ${transactionType === 'income' ? 'Receita' : 'Despesa'}`}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? `Atualize as informações da ${transactionType === 'income' ? 'receita' : 'despesa'}.`
              : `Registre uma nova ${transactionType === 'income' ? 'receita' : 'despesa'}.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                        {categoryOptions.map((option) => (
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
            </div>

            <FormField
              control={form.control}
              name="value"
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

            {transactionType === 'expense' && (
              <div className="grid grid-cols-2 gap-4">
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
                          {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
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
                {paymentMethod === 'credit-card' && (
                  <FormField
                    control={form.control}
                    name="creditCardId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cartão</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cartão" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {activeCards.map((card) => (
                              <SelectItem key={card.id} value={card.id}>
                                {card.name} - ****{card.lastFourDigits}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas adicionais..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{transaction ? 'Salvar' : 'Adicionar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

