'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useKaryawan, useDeactivateKaryawan } from '@/hooks/useKaryawan';
import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import Link from 'next/link';
import {
  STATUS_KARYAWAN,
  STATUS_KARYAWAN_COLORS,
  type StatusKaryawan,
} from '@/lib/constants';
import { formatDate } from '@/lib/helpers';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function KaryawanPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusKaryawan | 'all'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useKaryawan({
    search: search || undefined,
    status: status === 'all' ? undefined : status,
    page,
    limit,
  });

  const karyawanList = data?.data || [];

  const deactivateMutation = useDeactivateKaryawan();

  const handleDeactivate = async () => {
    if (deleteId) {
      await deactivateMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Karyawan</h1>
            <p className="text-gray-500 mt-1">
              Kelola data karyawan perusahaan
            </p>
          </div>
          <Link href="/karyawan/tambah">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Karyawan
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter</CardTitle>
            <CardDescription>
              Cari dan filter data karyawan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama atau NIK..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={status} onValueChange={(v: string) => setStatus(v as StatusKaryawan | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value={STATUS_KARYAWAN.AKTIF}>Aktif</SelectItem>
                    <SelectItem value={STATUS_KARYAWAN.NONAKTIF}>Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Karyawan</CardTitle>
            <CardDescription>
              Total: {data?.pagination?.total || 0} karyawan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : karyawanList && karyawanList.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIK</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Departemen</TableHead>
                      <TableHead>Tanggal Masuk</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {karyawanList.map((karyawan) => (
                      <TableRow key={karyawan.id}>
                        <TableCell className="font-medium">{karyawan.nik}</TableCell>
                        <TableCell>{karyawan.nama}</TableCell>
                        <TableCell>{karyawan.jabatan || '-'}</TableCell>
                        <TableCell>{karyawan.departemen || '-'}</TableCell>
                        <TableCell>{formatDate(karyawan.tanggalMasuk)}</TableCell>
                        <TableCell>
                          <Badge className={STATUS_KARYAWAN_COLORS[karyawan.status]}>
                            {karyawan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/karyawan/${karyawan.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/karyawan/${karyawan.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            {karyawan.status === STATUS_KARYAWAN.AKTIF && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteId(karyawan.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada data karyawan</p>
              </div>
            )}
            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Menampilkan {((data.pagination.page - 1) * data.pagination.limit) + 1} sampai {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} dari {data.pagination.total} karyawan
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(data.pagination.page - 1)}
                    disabled={data.pagination.page === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                      let pageNumber;
                      if (data.pagination.totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (data.pagination.page <= 3) {
                        pageNumber = i + 1;
                      } else if (data.pagination.page >= data.pagination.totalPages - 2) {
                        pageNumber = data.pagination.totalPages - 4 + i;
                      } else {
                        pageNumber = data.pagination.page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={data.pagination.page === pageNumber ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(pageNumber)}
                          className="min-w-[36px]"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(data.pagination.page + 1)}
                    disabled={data.pagination.page === data.pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan Karyawan?</AlertDialogTitle>
            <AlertDialogDescription>
              Karyawan akan dinonaktifkan dan tidak dapat login ke sistem. Data karyawan tetap tersimpan dan dapat diaktifkan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-red-600 hover:bg-red-700"
            >
              Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
