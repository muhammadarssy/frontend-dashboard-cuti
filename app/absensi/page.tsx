'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAbsensi } from '@/hooks/useAbsensi';
import { useState } from 'react';
import { Plus, Upload, Search, Eye, Calendar, Download } from 'lucide-react';
import Link from 'next/link';
import {
  STATUS_KEHADIRAN_LABELS,
  STATUS_KEHADIRAN_COLORS,
  type StatusKehadiran,
} from '@/lib/constants';
import { formatDate, toISODate } from '@/lib/helpers';
import { toast } from 'sonner';

// Helper function untuk format jam (HH:mm)
const formatJam = (date: Date | string | null): string => {
  if (!date) return '-';
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Helper function untuk cek telat
const isTelat = (date: Date | string | null): boolean => {
  if (!date) return false;
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  
  // Batas jam 08:15
  // Telat jika jam > 8 atau (jam === 8 dan menit > 15)
  return hours > 8 || (hours === 8 && minutes > 15);
};

export default function AbsensiPage() {
  const [tanggalMulai, setTanggalMulai] = useState(toISODate(new Date()));
  const [tanggalSelesai, setTanggalSelesai] = useState(toISODate(new Date()));
  const [statusFilter, setStatusFilter] = useState<StatusKehadiran | 'all'>('all');
  const [isManualFilter, setIsManualFilter] = useState<'all' | 'true' | 'false'>('all');
  const [page, setPage] = useState(1);
  const limit = 50;

  const { data, isLoading } = useAbsensi({
    tanggalMulai: tanggalMulai ? new Date(tanggalMulai).toISOString() : undefined,
    tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai).toISOString() : undefined,
    statusKehadiran: statusFilter === 'all' ? undefined : statusFilter,
    isManual: isManualFilter === 'all' ? undefined : isManualFilter === 'true',
    page,
    limit,
  });

  const absensiList = data?.data || [];
  const pagination = data?.pagination;

  // Handle export to Excel
  const handleExport = async () => {
    try {
      if (!tanggalMulai || !tanggalSelesai) {
        toast.error('Pilih tanggal mulai dan selesai terlebih dahulu');
        return;
      }

      const params = new URLSearchParams({
        tanggalMulai: new Date(tanggalMulai).toISOString(),
        tanggalSelesai: new Date(tanggalSelesai).toISOString(),
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/absensi/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Gagal export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Absensi_${tanggalMulai}_${tanggalSelesai}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Data berhasil diexport');
    } catch (error) {
      toast.error('Gagal export data');
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Absensi Karyawan</h1>
            <p className="text-gray-500 mt-1">Kelola data absensi karyawan</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Link href="/absensi/upload">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Fingerprint
              </Button>
            </Link>
            <Link href="/absensi/manual">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Input Manual
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Absensi</CardTitle>
            <CardDescription>Filter data absensi berdasarkan tanggal dan status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tanggal Mulai</label>
                <Input
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tanggal Selesai</label>
                <Input
                  type="date"
                  value={tanggalSelesai}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status Kehadiran</label>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === '' ? 'all' : v as StatusKehadiran | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    {Object.entries(STATUS_KEHADIRAN_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sumber Data</label>
                <Select value={isManualFilter} onValueChange={(v) => setIsManualFilter(v as 'all' | 'true' | 'false')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="false">Fingerprint</SelectItem>
                    <SelectItem value="true">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setPage(1); // Reset to page 1 when filtering
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Cari
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Absensi</CardTitle>
            <CardDescription>
              {pagination && `Menampilkan ${absensiList.length} dari ${pagination.total} data`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : absensiList.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jam Masuk</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sumber</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absensiList.map((absensi) => {
                      const jam = formatJam(absensi.jam);
                      const telat = isTelat(absensi.jam);
                      
                      return (
                        <TableRow key={absensi.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {formatDate(absensi.tanggal)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{absensi.karyawan.nik}</TableCell>
                          <TableCell>{absensi.karyawan.nama}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{jam}</span>
                              {telat && absensi.statusKehadiran === 'HADIR' && (
                                <Badge variant="destructive" className="text-xs">
                                  TELAT
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={STATUS_KEHADIRAN_COLORS[absensi.statusKehadiran]}>
                              {STATUS_KEHADIRAN_LABELS[absensi.statusKehadiran]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={absensi.isManual ? 'secondary' : 'outline'}>
                              {absensi.isManual ? 'Manual' : 'Fingerprint'}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm text-gray-500">
                            {absensi.keterangan || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/absensi/${absensi.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Menampilkan {((pagination.page - 1) * pagination.limit) + 1} sampai {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} data
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNumber;
                          if (pagination.totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNumber = i + 1;
                          } else if (pagination.page >= pagination.totalPages - 2) {
                            pageNumber = pagination.totalPages - 4 + i;
                          } else {
                            pageNumber = pagination.page - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={pagination.page === pageNumber ? 'default' : 'outline'}
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
                        onClick={() => setPage(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada data absensi</p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload data fingerprint atau input manual untuk menambah data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
