import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHealth } from '../hooks';
import { formatCurrency, calculateHealthSummary } from '../utils';
import { Heart, Calendar, Pill, DollarSign } from 'lucide-react';

export function HealthSummary() {
  const {
    recurringExpenses,
    totalRecurringExpenses,
    consultations,
    currentMonthConsultationsTotal,
    medications,
    currentMonthMedicationsTotal,
  } = useHealth();

  const summary = calculateHealthSummary(recurringExpenses, consultations, medications);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.total)}</div>
          <CardDescription className="mt-1">Soma de todas as despesas de saúde</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Recorrentes</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRecurringExpenses)}</div>
          <CardDescription className="mt-1">
            {recurringExpenses.filter((e) => e.active).length} despesa{recurringExpenses.filter((e) => e.active).length !== 1 ? 's' : ''} ativa{recurringExpenses.filter((e) => e.active).length !== 1 ? 's' : ''}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consultas do Mês</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentMonthConsultationsTotal)}</div>
          <CardDescription className="mt-1">
            {consultations.filter((c) => {
              const now = new Date();
              const consultationDate = new Date(c.date);
              return consultationDate.getMonth() === now.getMonth() && consultationDate.getFullYear() === now.getFullYear();
            }).length} consulta{consultations.filter((c) => {
              const now = new Date();
              const consultationDate = new Date(c.date);
              return consultationDate.getMonth() === now.getMonth() && consultationDate.getFullYear() === now.getFullYear();
            }).length !== 1 ? 's' : ''} este mês
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Medicamentos do Mês</CardTitle>
          <Pill className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentMonthMedicationsTotal)}</div>
          <CardDescription className="mt-1">
            {medications.filter((m) => m.active).length} medicamento{medications.filter((m) => m.active).length !== 1 ? 's' : ''} ativo{medications.filter((m) => m.active).length !== 1 ? 's' : ''}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

