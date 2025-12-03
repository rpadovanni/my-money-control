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
import { useHealth } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { ConsultationForm } from './ConsultationForm';
import { useState } from 'react';
import type { Consultation } from '../types';
import { Trash2, Edit, Plus } from 'lucide-react';

export function ConsultationsTable() {
  const { consultations, deleteConsultation } = useHealth();
  const [formOpen, setFormOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | undefined>();

  const handleEdit = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingConsultation(undefined);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Consultas</CardTitle>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Consulta
        </Button>
      </CardHeader>
      <CardContent>
        {consultations.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma consulta registrada. Clique em "Nova Consulta" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell>{formatDate(consultation.date)}</TableCell>
                  <TableCell className="font-medium">{consultation.description}</TableCell>
                  <TableCell>{consultation.doctor || '-'}</TableCell>
                  <TableCell>{consultation.specialty || '-'}</TableCell>
                  <TableCell>{formatCurrency(consultation.amount)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(consultation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteConsultation(consultation.id)}
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
      <ConsultationForm open={formOpen} onOpenChange={setFormOpen} consultation={editingConsultation} />
    </Card>
  );
}

