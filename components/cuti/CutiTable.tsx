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
import type { Cuti } from '@/types/cuti.types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Trash2, Edit } from 'lucide-react';
import { useDeleteCuti } from '@/hooks/useCuti';
import { useRouter } from 'next/navigation';

interface CutiTableProps {
  data: Cuti[];
  isLoading?: boolean;
}

export function CutiTable({ data, isLoading }: CutiTableProps) {
  const router = useRouter();
  const deleteMutation = useDeleteCuti();

  const handleDelete = (cutiId: string) => {
    deleteMutation.mutate(cutiId);
  };

  const handleEdit = (cutiId: string) => {
    router.push(`/cuti/${cutiId}`);
  };

  const getJenisCutiColor = (jenis: string) => {
    switch (jenis) {
      case 'TAHUNAN':
        return 'bg-blue-100 text-blue-800';
      case 'SAKIT':
        return 'bg-red-100 text-red-800';
      case 'IZIN':
        return 'bg-yellow-100 text-yellow-800';
      case 'BAKU':
        return 'bg-orange-100 text-orange-800';
      case 'TANPA_KETERANGAN':
        return 'bg-slate-100 text-slate-800';
      case 'LAINNYA':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Karyawan</TableHead>
              <TableHead>Jenis Cuti</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Durasi</TableHead>
              <TableHead>Alasan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
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
              <TableHead>Karyawan</TableHead>
              <TableHead>Jenis Cuti</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Durasi</TableHead>
              <TableHead>Alasan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <p className="text-lg font-medium">Tidak ada data cuti</p>
                  <p className="text-sm">Silakan tambah data cuti terlebih dahulu</p>
                </div>
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
            <TableHead>Karyawan</TableHead>
            <TableHead>Jenis Cuti</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-right">Durasi</TableHead>
            <TableHead>Alasan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cuti) => (
            <TableRow key={cuti.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{cuti.karyawan?.nama || '-'}</p>
                  <p className="text-sm text-gray-500 font-mono">{cuti.karyawan?.nik || '-'}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getJenisCutiColor(cuti.jenis)}>
                  {cuti.jenis?.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{format(new Date(cuti.tanggalMulai), 'dd MMM yyyy', { locale: id })}</p>
                  <p className="text-gray-500">
                    s/d {format(new Date(cuti.tanggalSelesai), 'dd MMM yyyy', { locale: id })}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">{cuti.jumlahHari} hari</TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate text-sm">{cuti.alasan || '-'}</p>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleEdit(cuti.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Data Cuti?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Data cuti akan dihapus dan saldo cuti akan dikembalikan. Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(cuti.id)}
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
