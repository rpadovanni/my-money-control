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
import type { Purchase, PurchaseFormData, PurchaseCategory } from '../types';
import { PURCHASE_CATEGORIES } from '../types';
import { usePurchases } from '../hooks';
import { useCreditCards } from '../hooks';

interface PurchaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase?: Purchase;
  defaultCardId?: string;
}

export function PurchaseForm({ open, onOpenChange, purchase, defaultCardId }: PurchaseFormProps) {
  const { addPurchase, updatePurchase } = usePurchases();
  const { cards } = useCreditCards();
  const activeCards = cards.filter((c) => c.active);

  const form = useForm<PurchaseFormData>({
    defaultValues: purchase
      ? {
          cardId: purchase.cardId,
          description: purchase.description,
          amount: purchase.amount,
          category: purchase.category,
          date: purchase.date.toISOString().split('T')[0],
          installments: purchase.installments || 1,
        }
      : {
          cardId: defaultCardId || activeCards[0]?.id || '',
          description: '',
          amount: 0,
          category: 'other',
          date: new Date().toISOString().split('T')[0],
          installments: 1,
        },
    mode: 'onChange',
  });

  const onSubmit = (data: PurchaseFormData) => {
    const purchaseData = {
      ...data,
      date: new Date(data.date),
    };
    if (purchase) {
      updatePurchase(purchase.id, purchaseData);
    } else {
      addPurchase(purchaseData);
    }
    form.reset();
    onOpenChange(false);
  };

  const categories = Object.entries(PURCHASE_CATEGORIES) as [PurchaseCategory, string][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{purchase ? 'Editar Compra' : 'Nova Compra'}</DialogTitle>
          <DialogDescription>
            {purchase ? 'Atualize as informações da compra.' : 'Registre uma nova compra no cartão de crédito.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cartão</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cartão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeCards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} •••• {card.lastFourDigits}
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
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
            </div>
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
                name="installments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcelas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="1"
                        value={field.value || 1}
                        onChange={(e) => field.onChange(Number(e.target.value) || 1)}
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
              <Button type="submit">{purchase ? 'Salvar' : 'Adicionar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
