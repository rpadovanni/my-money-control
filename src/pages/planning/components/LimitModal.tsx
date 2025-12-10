import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/shared/store';
import type { LimitCategory } from '@/shared/store/types/planning';

interface LimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId?: string | null;
}

export function LimitModal({ open, onOpenChange, editingId }: LimitModalProps) {
  const limits = useStore((state) => state.planning.limits);
  const addLimit = useStore((state) => state.addLimit);
  const updateLimit = useStore((state) => state.updateLimit);

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const editingLimit = editingId
    ? limits.find((l) => l.id === editingId)
    : null;

  useEffect(() => {
    if (editingLimit) {
      setCategory(editingLimit.category);
      setAmount(editingLimit.amount.toString());
    } else {
      setCategory('');
      setAmount('');
    }
  }, [editingLimit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !amount || Number(amount) <= 0) {
      return;
    }

    if (editingId && editingLimit) {
      updateLimit(editingId, {
        category: category.trim(),
        amount: Number(amount),
      });
    } else {
      addLimit({
        category: category.trim(),
        amount: Number(amount),
      });
    }

    onOpenChange(false);
    setCategory('');
    setAmount('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingId ? 'Editar Limite' : 'Adicionar Limite'}
          </DialogTitle>
          <DialogDescription>
            {editingId
              ? 'Atualize as informações do limite de categoria.'
              : 'Defina um novo limite de gasto para uma categoria.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                placeholder="Ex: Alimentação, Transporte..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingId ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

