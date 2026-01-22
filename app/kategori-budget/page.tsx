'use client';

import { useState } from 'react';
import { useKategoriBudgets } from '@/hooks/useKategoriBudget';
import { KategoriBudgetTable } from '@/components/kategori-budget/KategoriBudgetTable';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function KategoriBudgetPage() {
  const [page, setPage] = useState(1);
  const [isAktif, setIsAktif] = useState<boolean | undefined>(undefined);

  const { data, isLoading } = useKategoriBudgets(isAktif, page, 50);

  const handleSearch = () => {
    setPage(1);
  };

  const handleReset = () => {
    setIsAktif(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kategori Budget</h1>
          <p className="text-muted-foreground">Kelola kategori budget (departemen)</p>
        </div>
        <Link href="/kategori-budget/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kategori
          </Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="font-semibold">Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select
              value={isAktif === undefined ? 'all' : String(isAktif)}
              onValueChange={(value) =>
                setIsAktif(value === 'all' ? undefined : value === 'true')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua status</SelectItem>
                <SelectItem value="true">Aktif</SelectItem>
                <SelectItem value="false">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch}>Cari</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <KategoriBudgetTable data={data?.data || []} isLoading={isLoading} />

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Halaman {data.pagination.page} dari {data.pagination.totalPages} (Total:{' '}
              {data.pagination.total} kategori)
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
