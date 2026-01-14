'use client';

import { usePengeluaran } from '@/hooks/usePengeluaran';
import { PengeluaranForm } from '@/components/pengeluaran/PengeluaranForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPengeluaranPage({ params }: { params: { id: string } }) {
  const { data: pengeluaran, isLoading } = usePengeluaran(params.id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!pengeluaran) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800">Pengeluaran tidak ditemukan</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Pengeluaran</h1>
        <p className="text-muted-foreground">Perbarui transaksi pengeluaran</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <PengeluaranForm pengeluaran={pengeluaran} />
      </div>
    </div>
  );
}
