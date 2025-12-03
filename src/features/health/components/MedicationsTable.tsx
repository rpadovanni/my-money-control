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
import { useHealth } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { MedicationForm } from './MedicationForm';
import { useState } from 'react';
import type { Medication } from '../types';
import { MEDICATION_FREQUENCIES } from '../types';
import { Trash2, Edit, Plus, CheckCircle2, XCircle } from 'lucide-react';

export function MedicationsTable() {
  const { medications, deleteMedication, toggleMedicationActive } = useHealth();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | undefined>();

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingMedication(undefined);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medicamentos</CardTitle>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Medicamento
        </Button>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum medicamento registrado. Clique em "Novo Medicamento" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Término</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell className="font-medium">{medication.name}</TableCell>
                  <TableCell>{formatCurrency(medication.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {MEDICATION_FREQUENCIES[medication.frequency]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(medication.startDate)}</TableCell>
                  <TableCell>{medication.endDate ? formatDate(medication.endDate) : '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMedicationActive(medication.id)}
                      className="flex items-center gap-2"
                    >
                      {medication.active ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Ativo</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Inativo</span>
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(medication)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMedication(medication.id)}
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
      <MedicationForm open={formOpen} onOpenChange={setFormOpen} medication={editingMedication} />
    </Card>
  );
}

