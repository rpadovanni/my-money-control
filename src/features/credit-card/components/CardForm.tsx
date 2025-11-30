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
import type { CreditCard, CreditCardFormData } from '../types';
import { useCreditCards } from '../hooks';

interface CardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card?: CreditCard;
}

export function CardForm({ open, onOpenChange, card }: CardFormProps) {
  const { addCard, updateCard } = useCreditCards();
  const form = useForm<CreditCardFormData>({
    defaultValues: card
      ? {
          name: card.name,
          lastFourDigits: card.lastFourDigits,
          closingDay: card.closingDay,
          dueDay: card.dueDay,
          limit: card.limit,
        }
      : {
          name: '',
          lastFourDigits: '',
          closingDay: 10,
          dueDay: 15,
          limit: 0,
        },
    mode: 'onChange',
  });

  const onSubmit = (data: CreditCardFormData) => {
    if (card) {
      updateCard(card.id, data);
    } else {
      addCard(data);
    }
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{card ? 'Editar Cartão' : 'Novo Cartão'}</DialogTitle>
          <DialogDescription>
            {card ? 'Atualize as informações do cartão de crédito.' : 'Adicione um novo cartão de crédito ao sistema.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cartão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nubank" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastFourDigits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Últimos 4 Dígitos</FormLabel>
                  <FormControl>
                    <Input placeholder="1234" maxLength={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="closingDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Fechamento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={31}
                        placeholder="Ex: 10"
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 1 && value <= 31) {
                            field.onChange(value);
                          } else if (e.target.value === '') {
                            field.onChange(undefined);
                          }
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
                        min={1}
                        max={31}
                        placeholder="Ex: 15"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 1 && value <= 31) {
                            field.onChange(value);
                          } else if (e.target.value === '') {
                            field.onChange(undefined);
                          }
                        }}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite (R$)</FormLabel>
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{card ? 'Salvar' : 'Criar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
