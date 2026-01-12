'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SaldoCard } from '@/components/cuti-tahunan/SaldoCard';
import { useCutiTahunanById } from '@/hooks/useCutiTahunan';
import { useCuti } from '@/hooks/useCuti';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function CutiTahunanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: cutiTahunan, isLoading } = useCutiTahunanById(id);
  const { data: cutiData, isLoading: loadingCuti } = useCuti({
    karyawanId: cutiTahunan?.karyawanId,
    tahun: cutiTahunan?.tahun,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!cutiTahunan) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Data tidak ditemukan</p>
            <Button className="mt-4" onClick={() => router.push('/cuti-tahunan')}>
              Kembali ke Daftar
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/cuti-tahunan')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Detail Hak Cuti Tahunan</h1>
          <p className="text-gray-500 mt-1">
            Informasi lengkap hak cuti tahunan tahun {cutiTahunan.tahun}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SaldoCard data={cutiTahunan} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Informasi Karyawan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">NIK</p>
                <p className="font-mono font-medium">{cutiTahunan.karyawan?.nik}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-medium">{cutiTahunan.karyawan?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jabatan</p>
                <p className="font-medium">{cutiTahunan.karyawan?.jabatan || '-'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Detail Hak Cuti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Tanggal Bergabung</p>
                <p className="font-medium">
                  {cutiTahunan.karyawan?.tanggalMasuk
                    ? format(new Date(cutiTahunan.karyawan.tanggalMasuk), 'dd MMM yyyy', {
                        locale: localeId,
                      })
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jatah Dasar</p>
                <p className="font-medium">
                  {cutiTahunan.jatahDasar} hari
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tahun</p>
                <p className="font-medium">{cutiTahunan.tahun}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Penggunaan */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Penggunaan Cuti</CardTitle>
            <CardDescription>
              Daftar penggunaan cuti dari hak cuti tahun {cutiTahunan.tahun}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCuti ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : cutiData && cutiData.data && cutiData.data.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Cuti</TableHead>
                      <TableHead>Tanggal Mulai</TableHead>
                      <TableHead>Tanggal Selesai</TableHead>
                      <TableHead className="text-right">Durasi</TableHead>
                      <TableHead>Alasan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cutiData.data.map((cuti) => (
                      <TableRow key={cuti.id}>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {cuti.jenis?.replace('_', ' ').toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(cuti.tanggalMulai), 'dd MMM yyyy', { locale: localeId })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(cuti.tanggalSelesai), 'dd MMM yyyy', { locale: localeId })}
                        </TableCell>
                        <TableCell className="text-right">{cuti.jumlahHari} hari</TableCell>
                        <TableCell className="max-w-xs truncate">{cuti.alasan || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada riwayat penggunaan cuti</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
