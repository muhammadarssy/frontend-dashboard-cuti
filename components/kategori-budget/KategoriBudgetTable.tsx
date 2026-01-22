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
import type { KategoriBudget } from '@/types/budget.types';
import { Trash2, Edit } from 'lucide-react';
import { useDeleteKategoriBudget } from '@/hooks/useKategoriBudget';
import { useRouter } from 'next/navigation';

interface KategoriBudgetTableProps {
  data: KategoriBudget[];
  isLoading?: boolean;
}

export function KategoriBudgetTable({ data, isLoading }: KategoriBudgetTableProps) {
  const router = useRouter();
  const deleteMutation = useDeleteKategoriBudget();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    router.push(`/kategori-budget/${id}`);
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Jumlah Budget</TableHead>
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Jumlah Budget</TableHead>
              <TableHead className="text-right">Jumlah Item</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                Tidak ada data kategori budget
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
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Jumlah Budget</TableHead>
            <TableHead className="text-right">Jumlah Item</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((kategori) => (
            <TableRow key={kategori.id}>
              <TableCell className="font-medium">{kategori.nama}</TableCell>
              <TableCell>{kategori.deskripsi || '-'}</TableCell>
              <TableCell>
                <Badge variant={kategori.isAktif ? 'default' : 'secondary'}>
                  {kategori.isAktif ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {kategori._count?.budgetKategori || 0}
              </TableCell>
              <TableCell className="text-right">{kategori._count?.strukItem || 0}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(kategori.id)}>
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
                        <AlertDialogTitle>Hapus Kategori Budget</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus kategori budget{' '}
                          <strong>{kategori.nama}</strong>?
                          {kategori._count &&
                            (kategori._count.budgetKategori > 0 ||
                              kategori._count.strukItem > 0) && (
                              <span className="block mt-2 text-amber-600">
                                Kategori ini sudah digunakan pada{' '}
                                {kategori._count.budgetKategori} budget dan{' '}
                                {kategori._count.strukItem} item. Kategori akan dinonaktifkan (soft
                                delete).
                              </span>
                            )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(kategori.id)}
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
