import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTransactions } from '../hooks';
import {
  TRANSACTION_CATEGORIES,
  PAYMENT_METHODS,
} from '@/shared/store/types/transactions';
import { X } from 'lucide-react';

export function TransactionFilters() {
  const { filters, setFilters, clearFilters } = useTransactions();

  const hasActiveFilters =
    filters.type || filters.startDate || filters.endDate || filters.category || filters.paymentMethod;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={filters.type || 'all'}
              onValueChange={(value) =>
                setFilters({ type: value === 'all' ? undefined : (value as any) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) =>
                setFilters({ category: value === 'all' ? undefined : (value as any) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(TRANSACTION_CATEGORIES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Select
              value={filters.paymentMethod || 'all'}
              onValueChange={(value) =>
                setFilters({
                  paymentMethod: value === 'all' ? undefined : (value as any),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data Inicial</Label>
            <Input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => setFilters({ startDate: e.target.value || undefined })}
            />
          </div>

          <div className="space-y-2">
            <Label>Data Final</Label>
            <Input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => setFilters({ endDate: e.target.value || undefined })}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

