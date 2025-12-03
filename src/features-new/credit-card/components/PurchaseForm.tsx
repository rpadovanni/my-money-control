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
import { usePurchases, useCreditCards } from '../hooks';
import { useTransactions } from '../../transactions/hooks';
import type { PurchaseFormData, PurchaseCategory } from '../types';
import { PURCHASE_CATEGORIES } from '../types';
import { formatCurrencyWhileTyping } from '../utils';

interface PurchaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCardId?: string;
}

export function PurchaseForm({ open, onOpenChange, defaultCardId }: PurchaseFormProps) {
  const { activeCards } = useCreditCards();
  const { addPurchase } = usePurchases();
  const { addTransaction } = useTransactions();

  const form = useForm<PurchaseFormData & { description: string; installments?: number }>({
    defaultValues: {
      cardId: defaultCardId || '',
      description: '',
      amount: 0,
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      installments: 1,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: PurchaseFormData & { description: string; installments?: number }) => {
    // Create transaction first
    const transaction = addTransaction({
      date: data.date,
      category: data.category,
      value: data.amount,
      type: 'expense',
      paymentMethod: 'credit-card',
      creditCardId: data.cardId,
      notes: data.description,
    });

    // Then create purchase(s) linked to transaction
    const installments = data.installments || 1;
    addPurchase(
      {
        cardId: data.cardId,
        description: data.description,
        amount: data.amount,
        category: data.category,
        date: data.date,
        installments: installments > 1 ? installments : undefined,
      },
      transaction.id
    );

    form.reset();
    onOpenChange(false);
  };

  const categories = Object.entries(PURCHASE_CATEGORIES) as [PurchaseCategory, string][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Compra no Cartão</DialogTitle>
          <DialogDescription>
            Registre uma nova compra no cartão de crédito. Uma transação será criada automaticamente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cardId"
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Supermercado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            </div>

            <FormField
              control={form.control}
              name="installments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parcelas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      placeholder="1"
                      value={field.value || 1}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10) || 1;
                        field.onChange(Math.max(1, Math.min(24, value)));
                      }}
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
              <Button type="submit">Adicionar Compra</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
