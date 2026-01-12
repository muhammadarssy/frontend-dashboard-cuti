'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Users, Calendar, AlertCircle, TrendingDown, Plus, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useKaryawan } from '@/hooks/useKaryawan';
import { useCutiTahunan } from '@/hooks/useCutiTahunan';
import { useCuti } from '@/hooks/useCuti';

export default function DashboardPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const { data: karyawanList, isLoading: loadingKaryawan } = useKaryawan();
  const { data: cutiTahunanList, isLoading: loadingCutiTahunan } = useCutiTahunan({ tahun: currentYear });
  const { data: cutiData, isLoading: loadingCuti } = useCuti({ tahun: currentYear });
  const cutiList = cutiData?.data || [];

  // Calculate statistics
  const stats = {
    totalKaryawan: karyawanList?.filter(k => k.status === 'AKTIF').length || 0,
    cutiThisMonth: cutiList?.length || 0,
    lowBalance: cutiTahunanList?.filter(ct => ct.sisaCuti < 3).length || 0,
    needAttention: cutiTahunanList?.filter(ct => ct.sisaCuti === 0).length || 0,
  };

  const isLoading = loadingKaryawan || loadingCutiTahunan || loadingCuti;
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Ringkasan sistem manajemen cuti karyawan
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Karyawan Aktif
              </CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalKaryawan}</div>
                  <p className="text-xs text-gray-500 mt-1">karyawan terdaftar</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Cuti Bulan Ini
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.cutiThisMonth}</div>
                  <p className="text-xs text-gray-500 mt-1">pencatatan cuti</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Saldo Terendah
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-orange-600">{stats.lowBalance}</div>
                  <p className="text-xs text-gray-500 mt-1">saldo {'<'} 3 hari</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Perlu Perhatian
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-600">{stats.needAttention}</div>
                  <p className="text-xs text-gray-500 mt-1">saldo habis</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <CardTitle>Selamat Datang! 👋</CardTitle>
            <CardDescription>
              Sistem Manajemen Cuti Karyawan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Gunakan menu navigasi di sebelah kiri untuk mengakses fitur-fitur berikut:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Data Karyawan</strong> - Kelola data karyawan dan informasinya</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Cuti Tahunan</strong> - Generate dan kelola hak cuti tahunan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Data Cuti</strong> - Catat dan pantau penggunaan cuti</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Akses langsung ke fitur yang sering digunakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/karyawan/tambah')}
              >
                <Users className="h-6 w-6" />
                <span className="font-medium">Tambah Karyawan</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/cuti-tahunan')}
              >
                <FileText className="h-6 w-6" />
                <span className="font-medium">Generate Cuti Tahunan</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/cuti/tambah')}
              >
                <Plus className="h-6 w-6" />
                <span className="font-medium">Ajukan Cuti</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats - Coming Soon */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>5 cuti terakhir yang dicatat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Penggunaan Cuti</CardTitle>
              <CardDescription>Breakdown jenis cuti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
