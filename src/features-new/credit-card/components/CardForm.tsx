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
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreditCards } from '../hooks';
import type { CreditCard, CreditCardFormData } from '../types';
import { formatCurrency } from '../utils';
import { Trash2, Edit, Plus } from 'lucide-react';

export function CardForm() {
  const { cards, addCard, updateCard, deleteCard } = useCreditCards();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | undefined>();

  const form = useForm<CreditCardFormData>({
    defaultValues: editingCard
      ? {
          name: editingCard.name,
          lastFourDigits: editingCard.lastFourDigits,
          closingDay: editingCard.closingDay,
          dueDay: editingCard.dueDay,
          limit: editingCard.limit,
          active: editingCard.active,
        }
      : {
          name: '',
          lastFourDigits: '',
          closingDay: 10,
          dueDay: 15,
          limit: 0,
          active: true,
        },
    mode: 'onChange',
  });

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    form.reset({
      name: card.name,
      lastFourDigits: card.lastFourDigits,
      closingDay: card.closingDay,
      dueDay: card.dueDay,
      limit: card.limit,
      active: card.active,
    });
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCard(undefined);
    form.reset({
      name: '',
      lastFourDigits: '',
      closingDay: 10,
      dueDay: 15,
      limit: 0,
      active: true,
    });
    setFormOpen(true);
  };

  const onSubmit = (data: CreditCardFormData) => {
    if (editingCard) {
      updateCard(editingCard.id, data);
    } else {
      addCard(data);
    }
    form.reset();
    setFormOpen(false);
    setEditingCard(undefined);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cartões de Crédito</CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cartão
          </Button>
        </CardHeader>
        <CardContent>
          {cards.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum cartão cadastrado. Clique em "Novo Cartão" para adicionar.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Últimos 4 dígitos</TableHead>
                  <TableHead>Fechamento</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Limite</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">{card.name}</TableCell>
                    <TableCell>****{card.lastFourDigits}</TableCell>
                    <TableCell>Dia {card.closingDay}</TableCell>
                    <TableCell>Dia {card.dueDay}</TableCell>
                    <TableCell>{formatCurrency(card.limit)}</TableCell>
                    <TableCell>
                      <Badge variant={card.active ? 'default' : 'secondary'}>
                        {card.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(card)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCard(card.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCard ? 'Editar Cartão' : 'Novo Cartão'}
            </DialogTitle>
            <DialogDescription>
              {editingCard
                ? 'Atualize as informações do cartão.'
                : 'Cadastre um novo cartão de crédito.'}
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
                      <Input placeholder="Ex: Nubank, Itaú..." {...field} />
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
                    <FormLabel>Últimos 4 dígitos</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234"
                        maxLength={4}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          field.onChange(value);
                        }}
                      />
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
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Cartão Ativo</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Desative para ocultar o cartão sem deletá-lo
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingCard ? 'Salvar' : 'Adicionar'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
