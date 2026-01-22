'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { LabelStruk } from '@/types/budget.types';
import { Trash2, Edit } from 'lucide-react';
import { useDeleteLabelStruk } from '@/hooks/useLabelStruk';
import { useRouter } from 'next/navigation';

interface LabelStrukTableProps {
  data: LabelStruk[];
  isLoading?: boolean;
}

export function LabelStrukTable({ data, isLoading }: LabelStrukTableProps) {
  const router = useRouter();
  const deleteMutation = useDeleteLabelStruk();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    router.push(`/label-struk/${id}`);
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Warna</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Jumlah Item</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={6} className="h-16">
                  <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Warna</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Jumlah Item</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                Tidak ada data label
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Warna</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Jumlah Item</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((label) => (
            <TableRow key={label.id}>
              <TableCell className="font-medium">{label.nama}</TableCell>
              <TableCell>{label.deskripsi || '-'}</TableCell>
              <TableCell>
                {label.warna && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: label.warna }}
                    />
                    <span className="text-sm">{label.warna}</span>
                  </div>
                )}
                {!label.warna && '-'}
              </TableCell>
              <TableCell>
                <Badge variant={label.isAktif ? 'default' : 'secondary'}>
                  {label.isAktif ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{label._count?.strukItem || 0}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(label.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Label</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus label <strong>{label.nama}</strong>?
                          {label._count && label._count.strukItem > 0 && (
                            <span className="block mt-2 text-amber-600">
                              Label ini sudah digunakan pada {label._count.strukItem} item. Label akan
                              dinonaktifkan (soft delete).
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(label.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
