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
import type { Pengeluaran } from '@/types/pengeluaran.types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Trash2, Edit } from 'lucide-react';
import { useDeletePengeluaran } from '@/hooks/usePengeluaran';
import { useRouter } from 'next/navigation';

interface PengeluaranTableProps {
  data: Pengeluaran[];
  isLoading?: boolean;
}

export function PengeluaranTable({ data, isLoading }: PengeluaranTableProps) {
  const router = useRouter();
  const deleteMutation = useDeletePengeluaran();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    router.push(`/pengeluaran/${id}`);
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead>Keperluan</TableHead>
              <TableHead>Penerima</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={7} className="h-16">
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
              <TableHead>Tanggal</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead>Keperluan</TableHead>
              <TableHead>Penerima</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                Tidak ada data pengeluaran
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
            <TableHead>Tanggal</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead>Keperluan</TableHead>
            <TableHead>Penerima</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((pengeluaran) => (
            <TableRow key={pengeluaran.id}>
              <TableCell>
                {format(new Date(pengeluaran.tanggal), 'dd MMM yyyy', { locale: id })}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{pengeluaran.item.nama}</div>
                  <div className="text-sm text-muted-foreground">{pengeluaran.item.kode}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    pengeluaran.item.kategori === 'ATK'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }
                >
                  {pengeluaran.item.kategori}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {pengeluaran.jumlah} {pengeluaran.item.satuan}
              </TableCell>
              <TableCell>{pengeluaran.keperluan}</TableCell>
              <TableCell>{pengeluaran.penerima || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(pengeluaran.id)}>
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
                        <AlertDialogTitle>Hapus Pengeluaran</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus transaksi pengeluaran{' '}
                          <strong>{pengeluaran.item.nama}</strong>? Stok akan dikembalikan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(pengeluaran.id)}
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
