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
import type { Pembelian } from '@/types/pembelian.types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Trash2, Edit } from 'lucide-react';
import { useDeletePembelian } from '@/hooks/usePembelian';
import { useRouter } from 'next/navigation';

interface PembelianTableProps {
  data: Pembelian[];
  isLoading?: boolean;
}

export function PembelianTable({ data, isLoading }: PembelianTableProps) {
  const router = useRouter();
  const deleteMutation = useDeletePembelian();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    router.push(`/pembelian/${id}`);
  };

  const formatRupiah = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
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
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Harga Satuan</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={8} className="h-16">
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
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Harga Satuan</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                Tidak ada data pembelian
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
            <TableHead>Supplier</TableHead>
            <TableHead className="text-right">Harga Satuan</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((pembelian) => (
            <TableRow key={pembelian.id}>
              <TableCell>
                {format(new Date(pembelian.tanggal), 'dd MMM yyyy', { locale: id })}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{pembelian.item.nama}</div>
                  <div className="text-sm text-muted-foreground">{pembelian.item.kode}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    pembelian.item.kategori === 'ATK'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }
                >
                  {pembelian.item.kategori}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {pembelian.jumlah} {pembelian.item.satuan}
              </TableCell>
              <TableCell>{pembelian.supplier || '-'}</TableCell>
              <TableCell className="text-right">{formatRupiah(pembelian.hargaSatuan)}</TableCell>
              <TableCell className="text-right font-medium">
                {formatRupiah(pembelian.totalHarga)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(pembelian.id)}>
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
                        <AlertDialogTitle>Hapus Pembelian</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus transaksi pembelian{' '}
                          <strong>{pembelian.item.nama}</strong>? Stok akan dikurangi kembali.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(pembelian.id)}
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
