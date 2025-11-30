import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExpenses } from '../hooks';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, type ExpenseCategory, type PaymentMethod } from '../types';
import { X, Calendar } from 'lucide-react';

function formatDateForInput(date: Date | undefined): string {
  if (!date) return '';
  try {
    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (error) {
    console.error('Error formatting date:', error);
  }
  return '';
}

export function ExpenseFilters() {
  try {
    const { filters, setFilters, clearFilters, filterByCurrentMonth, filterByLastMonth } = useExpenses();

    const categories = Object.entries(EXPENSE_CATEGORIES) as [ExpenseCategory, string][];
    const paymentMethods = Object.entries(PAYMENT_METHODS) as [PaymentMethod, string][];

    const hasActiveFilters =
      (filters?.startDate && filters.startDate instanceof Date) ||
      (filters?.endDate && filters.endDate instanceof Date) ||
      filters?.category ||
      filters?.paymentMethod;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data Inicial</Label>
            <Input
              type="date"
              value={formatDateForInput(filters?.startDate)}
              onChange={(e) => {
                try {
                  setFilters({
                    ...(filters || {}),
                    startDate: e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined,
                  });
                } catch (error) {
                  console.error('Error setting start date:', error);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Data Final</Label>
            <Input
              type="date"
              value={formatDateForInput(filters?.endDate)}
              onChange={(e) => {
                try {
                  setFilters({
                    ...(filters || {}),
                    endDate: e.target.value ? new Date(e.target.value + 'T23:59:59') : undefined,
                  });
                } catch (error) {
                  console.error('Error setting end date:', error);
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Categoria</Label>
              {filters?.category && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    setFilters({
                      ...(filters || {}),
                      category: undefined,
                    });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select
              value={filters?.category || undefined}
              onValueChange={(value) => {
                try {
                  setFilters({
                    ...(filters || {}),
                    category: value as ExpenseCategory,
                  });
                } catch (error) {
                  console.error('Error setting category:', error);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Forma de Pagamento</Label>
              {filters?.paymentMethod && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    setFilters({
                      ...(filters || {}),
                      paymentMethod: undefined,
                    });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select
              value={filters?.paymentMethod || undefined}
              onValueChange={(value) => {
                try {
                  setFilters({
                    ...(filters || {}),
                    paymentMethod: value as PaymentMethod,
                  });
                } catch (error) {
                  console.error('Error setting payment method:', error);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as formas" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              try {
                filterByCurrentMonth();
              } catch (error) {
                console.error('Error filtering by current month:', error);
              }
            }}
          >
            Este Mês
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              try {
                filterByLastMonth();
              } catch (error) {
                console.error('Error filtering by last month:', error);
              }
            }}
          >
            Mês Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              try {
                clearFilters();
              } catch (error) {
                console.error('Error clearing filters:', error);
              }
            }}
          >
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  } catch (error) {
    console.error('Error rendering ExpenseFilters:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro ao carregar filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ocorreu um erro ao carregar os filtros. Por favor, recarregue a página.
          </p>
        </CardContent>
      </Card>
    );
  }
}

