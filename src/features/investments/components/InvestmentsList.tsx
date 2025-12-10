import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { useInvestments } from '../hooks';
import { formatCurrency, formatPercent } from '../utils';
import { InvestmentForm } from './InvestmentForm';
import { TransactionForm } from './TransactionForm';
import type { Asset, AssetPosition } from '@/shared/store/types/investments';
import { ASSET_TYPES } from '@/shared/store/types/investments';
import { Trash2, Edit, Plus, TrendingUp, TrendingDown } from 'lucide-react';

export function InvestmentsList() {
  const { positions, allAssets, deleteInvestment, recomendacaoDeCompra } = useInvestments();
  const [formOpen, setFormOpen] = useState(false);
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Asset | undefined>();
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>();

  const handleEdit = (asset: Asset) => {
    setEditingInvestment(asset);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingInvestment(undefined);
    setFormOpen(true);
  };

  const handleAddTransaction = (assetId?: string) => {
    setSelectedAssetId(assetId);
    setTransactionFormOpen(true);
  };

  // Combine positions with assets that have no positions
  const allItems: (AssetPosition | { asset: Asset; isNew: true })[] = [
    ...positions,
    ...allAssets
      .filter((asset) => !positions.some((p) => p.asset.id === asset.id))
      .map((asset) => ({ asset, isNew: true as const })),
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Investimentos</CardTitle>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Investimento
        </Button>
      </CardHeader>
      <CardContent>
        {allItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum investimento cadastrado. Clique em "Adicionar Investimento" para começar.
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.map((item) => {
                const isNew = 'isNew' in item && item.isNew;
                const position = isNew ? null : (item as AssetPosition);
                const asset = position?.asset || (item as { asset: Asset }).asset;
                const recommendation = recomendacaoDeCompra(asset.id);

                return (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{asset.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ASSET_TYPES[asset.type]}</Badge>
                    </TableCell>
                    <TableCell>
                      {position ? position.totalQuantity.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell>
                      {position ? formatCurrency(position.averagePrice) : '-'}
                    </TableCell>
                    <TableCell>
                      {position ? formatCurrency(position.currentPrice) : '-'}
                    </TableCell>
                    <TableCell>
                      {position ? formatCurrency(position.totalInvested) : '-'}
                    </TableCell>
                    <TableCell>
                      {position ? formatCurrency(position.currentValue) : '-'}
                    </TableCell>
                    <TableCell
                      className={
                        position
                          ? position.profitLoss >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                          : ''
                      }
                    >
                      {position ? formatCurrency(position.profitLoss) : '-'}
                    </TableCell>
                    <TableCell
                      className={
                        position
                          ? position.profitLossPercent >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                          : ''
                      }
                    >
                      {position ? (
                        <div className="flex items-center gap-1">
                          {position.profitLossPercent >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {formatPercent(position.profitLossPercent)}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!isNew && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAddTransaction(asset.id)}
                            title="Adicionar transação"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(asset)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteInvestment(asset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <InvestmentForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingInvestment(undefined);
        }}
        investment={editingInvestment}
      />
      <TransactionForm
        open={transactionFormOpen}
        onOpenChange={(open) => {
          setTransactionFormOpen(open);
          if (!open) setSelectedAssetId(undefined);
        }}
        assetId={selectedAssetId}
      />
    </Card>
  );
}

