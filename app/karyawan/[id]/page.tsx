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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useKaryawanById } from '@/hooks/useKaryawan';
import { useCutiTahunan } from '@/hooks/useCutiTahunan';
import { useCuti } from '@/hooks/useCuti';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { STATUS_KARYAWAN_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/helpers';

export default function DetailKaryawanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: karyawan, isLoading } = useKaryawanById(id);
  const { data: cutiTahunanList } = useCutiTahunan({ karyawanId: id });
  const { data: cutiData } = useCuti({ karyawanId: id });
  const cutiList = cutiData?.data || [];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!karyawan) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Karyawan tidak ditemukan</p>
          <Button className="mt-4" onClick={() => router.push('/karyawan')}>
            Kembali ke Daftar
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/karyawan">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{karyawan.nama}</h1>
              <p className="text-gray-500 mt-1">NIK: {karyawan.nik}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/karyawan/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Informasi Karyawan</CardTitle>
              <Badge className={STATUS_KARYAWAN_COLORS[karyawan.status]}>
                {karyawan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Jabatan</p>
                  <p className="font-medium">{karyawan.jabatan || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Departemen</p>
                  <p className="font-medium">{karyawan.departemen || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Tanggal Masuk</p>
                  <p className="font-medium">{formatDate(karyawan.tanggalMasuk)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cuti Tahunan */}
        <Card>
          <CardHeader>
            <CardTitle>Hak Cuti Tahunan</CardTitle>
            <CardDescription>Riwayat hak cuti tahunan karyawan</CardDescription>
          </CardHeader>
          <CardContent>
            {cutiTahunanList && cutiTahunanList.length > 0 ? (
              <div className="space-y-3">
                {cutiTahunanList.map((ct) => (
                  <div key={ct.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Tahun {ct.tahun}</p>
                      <p className="text-sm text-gray-500">{ct.tipe}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Sisa Saldo</p>
                      <p className="text-2xl font-bold text-blue-600">{ct.sisaCuti} hari</p>
                      <p className="text-xs text-gray-500">dari {ct.jatahDasar} hari</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Belum ada data cuti tahunan</p>
            )}
          </CardContent>
        </Card>

        {/* Riwayat Cuti */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Penggunaan Cuti</CardTitle>
            <CardDescription>5 cuti terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            {cutiList && cutiList.length > 0 ? (
              <div className="space-y-3">
                {cutiList.slice(0, 5).map((cuti) => (
                  <div key={cuti.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{cuti.jenis}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(cuti.tanggalMulai)} - {formatDate(cuti.tanggalSelesai)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{cuti.jumlahHari} hari</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{cuti.alasan}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Belum ada riwayat cuti</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
