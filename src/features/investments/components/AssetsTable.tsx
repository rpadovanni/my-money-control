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
import { useInvestments } from '../hooks';
import { formatDate } from '../utils';
import { AssetForm } from './AssetForm';
import type { Asset } from '../types';
import { ASSET_TYPES } from '../types';
import { Trash2, Edit, Plus } from 'lucide-react';

export function AssetsTable() {
  const { assets, deleteAsset } = useInvestments();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>();

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingAsset(undefined);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ativos Cadastrados</CardTitle>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Ativo
        </Button>
      </CardHeader>
      <CardContent>
        {assets.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum ativo cadastrado. Clique em "Novo Ativo" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cadastrado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.code}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{ASSET_TYPES[asset.type]}</TableCell>
                  <TableCell>{formatDate(asset.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
                        onClick={() => deleteAsset(asset.id)}
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
      <AssetForm open={formOpen} onOpenChange={setFormOpen} asset={editingAsset} />
    </Card>
  );
}

