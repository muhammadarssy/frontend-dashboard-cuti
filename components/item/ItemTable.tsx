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
import type { Item } from '@/types/item.types';
import { Trash2, Edit, AlertTriangle } from 'lucide-react';
import { useDeleteItem } from '@/hooks/useItem';
import { useRouter } from 'next/navigation';

interface ItemTableProps {
  data: Item[];
  isLoading?: boolean;
}

export function ItemTable({ data, isLoading }: ItemTableProps) {
  const router = useRouter();
  const deleteMutation = useDeleteItem();

  const handleDelete = (itemId: string) => {
    deleteMutation.mutate(itemId);
  };

  const handleEdit = (itemId: string) => {
    router.push(`/item/${itemId}`);
  };

  const getKategoriColor = (kategori: string) => {
    return kategori === 'ATK' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const isStokMenipis = (stokSekarang: number, stokMinimal: number) => {
    return stokSekarang <= stokMinimal;
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Nama Item</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead className="text-right">Stok Sekarang</TableHead>
              <TableHead className="text-right">Stok Minimal</TableHead>
              <TableHead>Status</TableHead>
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
              <TableHead>Kode</TableHead>
              <TableHead>Nama Item</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead className="text-right">Stok Sekarang</TableHead>
              <TableHead className="text-right">Stok Minimal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                Tidak ada data item
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
            <TableHead>Kode</TableHead>
            <TableHead>Nama Item</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Satuan</TableHead>
            <TableHead className="text-right">Stok Sekarang</TableHead>
            <TableHead className="text-right">Stok Minimal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.kode}</TableCell>
              <TableCell>{item.nama}</TableCell>
              <TableCell>
                <Badge className={getKategoriColor(item.kategori)}>{item.kategori}</Badge>
              </TableCell>
              <TableCell>{item.satuan}</TableCell>
              <TableCell className="text-right">{item.stokSekarang}</TableCell>
              <TableCell className="text-right">{item.stokMinimal}</TableCell>
              <TableCell>
                {isStokMenipis(item.stokSekarang, item.stokMinimal) ? (
                  <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                    <AlertTriangle className="h-3 w-3" />
                    Menipis
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600">
                    Normal
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(item.id)}>
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
                        <AlertDialogTitle>Hapus Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus item <strong>{item.nama}</strong>?
                          Aksi ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
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
