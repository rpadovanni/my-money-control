import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '../hooks';
import { CustomCategoryForm } from './CustomCategoryForm';
import { useState } from 'react';
import type { CustomCategory } from '../types';
import { Trash2, Edit, Plus } from 'lucide-react';

export function CustomCategories() {
  const { customCategories, deleteCustomCategory } = useSettings();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | undefined>();

  const handleEdit = (category: CustomCategory) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(undefined);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categorias Personalizadas</CardTitle>
          <CardDescription>Crie e gerencie suas próprias categorias</CardDescription>
        </div>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </CardHeader>
      <CardContent>
        {customCategories.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma categoria personalizada criada. Clique em "Nova Categoria" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Ícone</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant={category.type === 'expense' ? 'destructive' : 'default'}>
                      {category.type === 'expense' ? 'Despesa' : 'Receita'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {category.color ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-muted-foreground">{category.color}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {category.icon || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCustomCategory(category.id)}
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
      <CustomCategoryForm open={formOpen} onOpenChange={setFormOpen} category={editingCategory} />
    </Card>
  );
}

