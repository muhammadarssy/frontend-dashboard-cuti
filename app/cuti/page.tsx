'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { CutiTable } from '@/components/cuti/CutiTable';
import { useCuti } from '@/hooks/useCuti';
import { useKaryawan } from '@/hooks/useKaryawan';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Plus, Filter, Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CutiPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<CutiFilter>({
    tahun: currentYear,
    page: 1,
    limit: 10,
  });
  const [openKaryawan, setOpenKaryawan] = useState(false);

  const { data, isLoading } = useCuti(filters);
  const { data: karyawanData } = useKaryawan({ status: 'AKTIF' });
  const karyawanList = karyawanData?.data || [];
  const cutiList = data?.data || [];
  const pagination = data?.pagination;

  const handleFilterChange = (key: keyof CutiFilter, value: string | number) => {
    setFilters((prev) => ({ 
      ...prev, 
      [key]: value === 'all' || value === '' ? undefined : value,
      page: 1 // Reset to page 1 when filter changes
    }));
  };

  const clearFilters = () => {
    setFilters({
      tahun: currentYear,
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Generate tahun options
  const tahunOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const stats = {
    total: pagination?.total || cutiList?.length || 0,
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Karyawan</Label>
                <Popover open={openKaryawan} onOpenChange={setOpenKaryawan}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openKaryawan}
                      className="w-full justify-between"
                    >
                      {filters.karyawanId
                        ? karyawanList?.find((k) => k.id === filters.karyawanId)?.nama
                        : 'Pilih karyawan...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari nama..." />
                      <CommandList>
                        <CommandEmpty>Karyawan tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="all"
                            onSelect={() => {
                              handleFilterChange('karyawanId', '');
                              setOpenKaryawan(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                !filters.karyawanId ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            Semua Karyawan
                          </CommandItem>
                          {karyawanList?.map((karyawan) => (
                            <CommandItem
                              key={karyawan.id}
                              value={karyawan.nama}
                              onSelect={() => {
                                handleFilterChange('karyawanId', karyawan.id);
                                setOpenKaryawan(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  filters.karyawanId === karyawan.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {karyawan.nama}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

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
                    <SelectItem value="BAKU">Cuti Baku</SelectItem>
                    <SelectItem value="TANPA_KETERANGAN">Tanpa Keterangan</SelectItem>
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

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
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
                          onClick={() => handlePageChange(pageNumber)}
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
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
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
