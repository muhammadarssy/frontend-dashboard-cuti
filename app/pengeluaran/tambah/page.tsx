'use client';

import { PengeluaranForm } from '@/components/pengeluaran/PengeluaranForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TambahPengeluaranContent() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Pengeluaran</h1>
        <p className="text-muted-foreground">Tambahkan transaksi pengeluaran barang baru</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <PengeluaranForm defaultItemId={itemId || undefined} />
      </div>
    </div>
  );
}

export default function TambahPengeluaranPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TambahPengeluaranContent />
    </Suspense>
  );
}
