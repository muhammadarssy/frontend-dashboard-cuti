'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { CutiTable } from '@/components/cuti/CutiTable';
import { useCuti } from '@/hooks/useCuti';
import type { CutiFilter } from '@/types/cuti.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CutiPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<CutiFilter>({
    tahun: currentYear,
  });

  const { data, isLoading } = useCuti(filters);
  const cutiList = data?.data || [];
  const pagination = data?.pagination;

  const handleFilterChange = (key: keyof CutiFilter, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value === 'all' || value === '' ? undefined : value }));
  };

  const clearFilters = () => {
    setFilters({
      tahun: currentYear,
    });
  };

  // Generate tahun and bulan options
  const tahunOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const bulanOptions = [
    { value: 0, label: 'Semua Bulan' },
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const stats = {
    total: cutiList?.length || 0,
    tahunan: cutiList?.filter((c) => c.jenis === 'TAHUNAN').length || 0,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Cuti</h1>
            <p className="text-gray-500 mt-1">
              Kelola pencatatan cuti karyawan
            </p>
          </div>
          <Button onClick={() => router.push('/cuti/tambah')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Cuti
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Cuti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">dalam periode ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Cuti Tahunan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.tahunan}</div>
              <p className="text-xs text-gray-500 mt-1">dari total cuti</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daftar Cuti</CardTitle>
                <CardDescription>
                  Data pencatatan cuti karyawan
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Reset Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Cuti</Label>
                <Select
                  value={filters.jenis || 'all'}
                  onValueChange={(value) => handleFilterChange('jenis', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="TAHUNAN">Cuti Tahunan</SelectItem>
                    <SelectItem value="SAKIT">Cuti Sakit</SelectItem>
                    <SelectItem value="IZIN">Izin</SelectItem>
                    <SelectItem value="LAINNYA">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tahun</Label>
                <Select
                  value={filters.tahun?.toString() || currentYear.toString()}
                  onValueChange={(value) => handleFilterChange('tahun', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tahunOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <CutiTable data={cutiList || []} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">ℹ️ Informasi</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Status Disetujui:</strong> Cuti akan langsung mengurangi saldo cuti tahunan
              </li>
              <li>
                <strong>Hapus Cuti:</strong> Saldo cuti akan dikembalikan otomatis
              </li>
              <li>
                <strong>Durasi:</strong> Dihitung berdasarkan hari kerja (Senin-Jumat)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
