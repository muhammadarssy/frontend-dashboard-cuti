'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import type { Struk } from '@/types/budget.types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Trash2, Edit, Eye } from 'lucide-react';
import { useDeleteStruk } from '@/hooks/useStruk';
import { useRouter } from 'next/navigation';

interface StrukTableProps {
  data: Struk[];
  isLoading?: boolean;
}

const bulanNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function StrukTable({ data, isLoading }: StrukTableProps) {
  const router = useRouter();
  const deleteMutation = useDeleteStruk();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    router.push(`/struk/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/struk/${id}`);
  };

  const formatRupiah = (value: number) => {
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
              <TableHead>Nomor Struk</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="text-right">Total Harga</TableHead>
              <TableHead className="text-right">Total Setelah Tax</TableHead>
              <TableHead className="text-right">Jumlah Item</TableHead>
              <TableHead>Aksi</TableHead>
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
              <TableHead>Nomor Struk</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="text-right">Total Harga</TableHead>
              <TableHead className="text-right">Total Setelah Tax</TableHead>
              <TableHead className="text-right">Jumlah Item</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                Tidak ada data struk
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
            <TableHead>Nomor Struk</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead className="text-right">Total Harga</TableHead>
            <TableHead className="text-right">Total Setelah Tax</TableHead>
            <TableHead className="text-right">Jumlah Item</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((struk) => (
            <TableRow key={struk.id}>
              <TableCell>
                {format(new Date(struk.tanggal), 'dd MMM yyyy', { locale: id })}
              </TableCell>
              <TableCell>{struk.nomorStruk || '-'}</TableCell>
              <TableCell>
                {struk.budget
                  ? `${bulanNames[struk.budget.bulan - 1]} ${struk.budget.tahun}`
                  : '-'}
              </TableCell>
              <TableCell className="text-right">{formatRupiah(struk.totalHarga)}</TableCell>
              <TableCell className="text-right font-medium">
                {formatRupiah(struk.totalSetelahTax)}
              </TableCell>
              <TableCell className="text-right">{struk._count?.strukItem || 0}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleView(struk.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(struk.id)}>
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
                        <AlertDialogTitle>Hapus Struk</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus struk{' '}
                          <strong>{struk.nomorStruk || 'tanpa nomor'}</strong>? Semua item dalam
                          struk ini juga akan dihapus.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(struk.id)}
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
