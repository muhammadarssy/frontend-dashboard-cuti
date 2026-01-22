'use client';

import { useState } from 'react';
import { useBudgets } from '@/hooks/useBudget';
import { BudgetTable } from '@/components/budget/BudgetTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function BudgetPage() {
  const [page, setPage] = useState(1);
  const [tahun, setTahun] = useState<number | undefined>(new Date().getFullYear());

  const { data, isLoading } = useBudgets(tahun, page, 20);

  const handleSearch = () => {
    setPage(1);
  };

  const handleReset = () => {
    setTahun(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budget</h1>
          <p className="text-muted-foreground">Kelola budget per bulan dan tahun</p>
        </div>
        <Link href="/budget/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Budget
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
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch}>Cari</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <BudgetTable data={data?.data || []} isLoading={isLoading} />

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Halaman {data.pagination.page} dari {data.pagination.totalPages} (Total:{' '}
              {data.pagination.total} budget)
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
