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
import { Users, Calendar, AlertCircle, TrendingDown, Plus, FileText, Package, ShoppingCart, PackageX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useKaryawan } from '@/hooks/useKaryawan';
import { useCutiTahunan } from '@/hooks/useCutiTahunan';
import { useCuti } from '@/hooks/useCuti';
import { useItems } from '@/hooks/useItem';

export default function DashboardPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const { data: karyawanList, isLoading: loadingKaryawan } = useKaryawan();
  const { data: cutiTahunanList, isLoading: loadingCutiTahunan } = useCutiTahunan({ tahun: currentYear });
  const { data: cutiData, isLoading: loadingCuti } = useCuti({ tahun: currentYear });
  const cutiList = cutiData?.data || [];
  
  // Inventory data
  const { data: itemsData, isLoading: loadingItems } = useItems(undefined, undefined, undefined, undefined, 1, 1000);
  const items = itemsData?.data || [];

  // Calculate statistics - Cuti
  const cutiStats = {
    totalKaryawan: karyawanList?.filter(k => k.status === 'AKTIF').length || 0,
    cutiThisMonth: cutiList?.length || 0,
    lowBalance: cutiTahunanList?.filter(ct => ct.sisaCuti < 3).length || 0,
    needAttention: cutiTahunanList?.filter(ct => ct.sisaCuti === 0).length || 0,
  };

  // Calculate statistics - Inventory
  const inventoryStats = {
    totalItems: items.length || 0,
    stokMenipis: items.filter(item => item.stokSekarang <= item.stokMinimal).length || 0,
    stokHabis: items.filter(item => item.stokSekarang === 0).length || 0,
  };

  const isLoading = loadingKaryawan || loadingCutiTahunan || loadingCuti || loadingItems;
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Ringkasan sistem manajemen cuti & inventory
          </p>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Akses langsung ke fitur yang sering digunakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/karyawan/tambah')}
              >
                <Users className="h-6 w-6" />
                <span className="font-medium text-xs">Tambah Karyawan</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/cuti-tahunan')}
              >
                <FileText className="h-6 w-6" />
                <span className="font-medium text-xs">Generate Cuti</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/cuti/tambah')}
              >
                <Plus className="h-6 w-6" />
                <span className="font-medium text-xs">Ajukan Cuti</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/item/tambah')}
              >
                <Package className="h-6 w-6" />
                <span className="font-medium text-xs">Tambah Item</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/pembelian/tambah')}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="font-medium text-xs">Input Pembelian</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/pengeluaran/tambah')}
              >
                <TrendingDown className="h-6 w-6" />
                <span className="font-medium text-xs">Input Pengeluaran</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cuti Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Manajemen Cuti
          </h2>
          
          {/* Summary Cards - Cuti */}
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
                    <div className="text-2xl font-bold">{cutiStats.totalKaryawan}</div>
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
                    <div className="text-2xl font-bold">{cutiStats.cutiThisMonth}</div>
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
                    <div className="text-2xl font-bold text-orange-600">{cutiStats.lowBalance}</div>
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
                    <div className="text-2xl font-bold text-red-600">{cutiStats.needAttention}</div>
                    <p className="text-xs text-gray-500 mt-1">saldo habis</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Management
          </h2>
          
          {/* Summary Cards - Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Item
                </CardTitle>
                <Package className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{inventoryStats.totalItems}</div>
                    <p className="text-xs text-gray-500 mt-1">item terdaftar</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Stok Menipis
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-orange-600">{inventoryStats.stokMenipis}</div>
                    <p className="text-xs text-gray-500 mt-1">perlu restock</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Stok Habis
                </CardTitle>
                <PackageX className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-red-600">{inventoryStats.stokHabis}</div>
                    <p className="text-xs text-gray-500 mt-1">stok kosong</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
