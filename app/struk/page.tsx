'use client';

import { useState } from 'react';
import { useStruks } from '@/hooks/useStruk';
import { StrukTable } from '@/components/struk/StrukTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function StrukPage() {
  const [page, setPage] = useState(1);
  const [budgetId, setBudgetId] = useState<string>('');
  const [tahun, setTahun] = useState<number | undefined>(new Date().getFullYear());
  const [bulan, setBulan] = useState<number | undefined>(undefined);

  const { data, isLoading } = useStruks(budgetId || undefined, tahun, bulan, page, 20);

  const handleSearch = () => {
    setPage(1);
  };

  const handleReset = () => {
    setBudgetId('');
    setTahun(undefined);
    setBulan(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Struk Pembelian</h1>
          <p className="text-muted-foreground">Kelola struk pembelian dengan items</p>
        </div>
        <Link href="/struk/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Struk
          </Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="font-semibold">Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Tahun</label>
            <Input
              type="number"
              placeholder="2026"
              value={tahun || ''}
              onChange={(e) =>
                setTahun(e.target.value === '' ? undefined : Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Bulan</label>
            <Select
              value={bulan ? String(bulan) : 'all'}
              onValueChange={(value) => setBulan(value === 'all' ? undefined : Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua bulan</SelectItem>
                <SelectItem value="1">Januari</SelectItem>
                <SelectItem value="2">Februari</SelectItem>
                <SelectItem value="3">Maret</SelectItem>
                <SelectItem value="4">April</SelectItem>
                <SelectItem value="5">Mei</SelectItem>
                <SelectItem value="6">Juni</SelectItem>
                <SelectItem value="7">Juli</SelectItem>
                <SelectItem value="8">Agustus</SelectItem>
                <SelectItem value="9">September</SelectItem>
                <SelectItem value="10">Oktober</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">Desember</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Cari
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <StrukTable data={data?.data || []} isLoading={isLoading} />

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Halaman {data.pagination.page} dari {data.pagination.totalPages} (Total:{' '}
              {data.pagination.total} struk)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.pagination.totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
