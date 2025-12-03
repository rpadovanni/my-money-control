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
import type { Asset, AssetFormData, AssetType } from '../types';
import { ASSET_TYPES } from '../types';
import { useInvestments } from '../hooks';

interface AssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: Asset;
}

export function AssetForm({ open, onOpenChange, asset }: AssetFormProps) {
  const { addAsset, updateAsset } = useInvestments();

  const form = useForm<AssetFormData>({
    defaultValues: asset
      ? {
          name: asset.name,
          code: asset.code,
          type: asset.type,
        }
      : {
          name: '',
          code: '',
          type: 'stock',
        },
    mode: 'onChange',
  });

  const onSubmit = async (data: AssetFormData) => {
    if (asset) {
      await updateAsset(asset.id, data);
    } else {
      await addAsset(data);
    }
    form.reset();
    onOpenChange(false);
  };

  const assetTypes = Object.entries(ASSET_TYPES) as [AssetType, string][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{asset ? 'Editar Ativo' : 'Novo Ativo'}</DialogTitle>
          <DialogDescription>
            {asset ? 'Atualize as informações do ativo.' : 'Cadastre um novo ativo para investimento.'}
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
              <Button type="submit">{asset ? 'Salvar' : 'Adicionar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

