import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useInvestments } from '../hooks';
import { formatCurrency, formatPercent } from '../utils';
import { ASSET_TYPES } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function PositionSummary() {
  const {
    positions,
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalProfitLossPercent,
  } = useInvestments();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro/Prejuízo</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(totalProfitLoss)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold flex items-center gap-2 ${
                totalProfitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {totalProfitLossPercent >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {formatPercent(totalProfitLossPercent)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posições Atuais</CardTitle>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma posição aberta. Adicione transações para ver suas posições.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Médio</TableHead>
                  <TableHead>Preço Atual</TableHead>
                  <TableHead>Total Investido</TableHead>
                  <TableHead>Valor Atual</TableHead>
                  <TableHead>Lucro/Prejuízo</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position.asset.id}>
                    <TableCell className="font-medium">{position.asset.name}</TableCell>
                    <TableCell>{position.asset.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ASSET_TYPES[position.asset.type]}</Badge>
                    </TableCell>
                    <TableCell>{position.totalQuantity.toFixed(2)}</TableCell>
                    <TableCell>{formatCurrency(position.averagePrice)}</TableCell>
                    <TableCell>{formatCurrency(position.currentPrice)}</TableCell>
                    <TableCell>{formatCurrency(position.totalInvested)}</TableCell>
                    <TableCell>{formatCurrency(position.currentValue)}</TableCell>
                    <TableCell
                      className={
                        position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {formatCurrency(position.profitLoss)}
                    </TableCell>
                    <TableCell
                      className={
                        position.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {formatPercent(position.profitLossPercent)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

