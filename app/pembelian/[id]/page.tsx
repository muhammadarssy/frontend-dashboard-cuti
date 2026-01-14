'use client';

import { usePembelian } from '@/hooks/usePembelian';
import { PembelianForm } from '@/components/pembelian/PembelianForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPembelianPage({ params }: { params: { id: string } }) {
  const { data: pembelian, isLoading } = usePembelian(params.id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!pembelian) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800">Pembelian tidak ditemukan</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Pembelian</h1>
        <p className="text-muted-foreground">Perbarui transaksi pembelian</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <PembelianForm pembelian={pembelian} />
      </div>
    </div>
  );
}
