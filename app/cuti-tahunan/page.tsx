'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { CutiTahunanTable } from '@/components/cuti-tahunan/CutiTahunanTable';
import { GenerateDialog } from '@/components/cuti-tahunan/GenerateDialog';
import { useCutiTahunan } from '@/hooks/useCutiTahunan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Calendar, TrendingDown, Users } from 'lucide-react';

export default function CutiTahunanPage() {
  const currentYear = new Date().getFullYear();
  const [selectedTahun, setSelectedTahun] = useState<string>(currentYear.toString());

  const { data: cutiTahunanList, isLoading } = useCutiTahunan({
    tahun: parseInt(selectedTahun),
  });

  // Generate tahun options (past 2 years to future 2 years)
  const tahunOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - 2 + i;
    return year.toString();
  });

  // Calculate statistics
  const stats = {
    total: cutiTahunanList?.length || 0,
    lowBalance: cutiTahunanList?.filter((item) => item.sisaCuti < 3).length || 0,
    totalSisa: cutiTahunanList?.reduce((sum, item) => sum + item.sisaCuti, 0) || 0,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cuti Tahunan</h1>
            <p className="text-gray-500 mt-1">
              Kelola hak cuti tahunan karyawan
            </p>
          </div>
          <GenerateDialog />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Karyawan
              </CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">dengan hak cuti tahun {selectedTahun}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Saldo Rendah
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lowBalance}</div>
              <p className="text-xs text-gray-500 mt-1">karyawan dengan saldo {'<'} 3 hari</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Sisa Cuti
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSisa}</div>
              <p className="text-xs text-gray-500 mt-1">hari keseluruhan</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daftar Hak Cuti Tahunan</CardTitle>
                <CardDescription>
                  Rekap hak cuti tahunan per karyawan
                </CardDescription>
              </div>
              <div className="w-[180px]">
                <Label htmlFor="filter-tahun" className="text-sm">
                  Filter Tahun
                </Label>
                <Select value={selectedTahun} onValueChange={setSelectedTahun}>
                  <SelectTrigger id="filter-tahun">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tahunOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CutiTahunanTable data={cutiTahunanList || []} isLoading={isLoading} />
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
                <strong>Generate Cuti Tahunan:</strong> Sistem akan otomatis menghitung jatah berdasarkan masa kerja
              </li>
              <li>
                <strong>Tahun Pertama:</strong> Jatah akan diprorate berdasarkan tanggal bergabung
              </li>
              <li>
                <strong>Tahun Berikutnya:</strong> Jatah penuh 12 hari + sisa tahun lalu (carry forward)
              </li>
              <li>
                <strong>Saldo Rendah:</strong> Ditandai dengan warna oranye jika sisa cuti kurang dari 3 hari
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
