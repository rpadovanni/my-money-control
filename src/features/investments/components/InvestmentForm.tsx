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
import type { Asset, AssetFormData, AssetType } from '@/shared/store/types/investments';
import { ASSET_TYPES } from '@/shared/store/types/investments';
import { useInvestments } from '../hooks';

interface InvestmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment?: Asset;
}

export function InvestmentForm({ open, onOpenChange, investment }: InvestmentFormProps) {
  const { addInvestment, updateInvestment } = useInvestments();

  const form = useForm<AssetFormData>({
    defaultValues: investment
      ? {
          name: investment.name,
          code: investment.code,
          type: investment.type,
        }
      : {
          name: '',
          code: '',
          type: 'stock',
        },
    mode: 'onChange',
  });

  const onSubmit = (data: AssetFormData) => {
    if (investment) {
      updateInvestment(investment.id, data);
    } else {
      addInvestment(data);
    }
    form.reset();
    onOpenChange(false);
  };

  const assetTypes = Object.entries(ASSET_TYPES) as [AssetType, string][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{investment ? 'Editar Investimento' : 'Novo Investimento'}</DialogTitle>
          <DialogDescription>
            {investment
              ? 'Atualize as informações do investimento.'
              : 'Cadastre um novo ativo para investimento.'}
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
                    <Input placeholder="Ex: Petrobras" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código/Ticker</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: PETR4" {...field} />
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
                        {assetTypes.map(([value, label]) => (
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
              <Button type="submit">{investment ? 'Salvar' : 'Adicionar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


