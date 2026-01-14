'use client';

import { PembelianForm } from '@/components/pembelian/PembelianForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TambahPembelianContent() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Pembelian</h1>
        <p className="text-muted-foreground">Tambahkan transaksi pembelian barang baru</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <PembelianForm defaultItemId={itemId || undefined} />
      </div>
    </div>
  );
}

export default function TambahPembelianPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TambahPembelianContent />
    </Suspense>
  );
}
