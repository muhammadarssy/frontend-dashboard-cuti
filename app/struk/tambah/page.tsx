'use client';

import { StrukForm } from '@/components/struk/StrukForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TambahStrukContent() {
  const searchParams = useSearchParams();
  const budgetId = searchParams.get('budgetId');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Struk</h1>
        <p className="text-muted-foreground">Tambahkan struk pembelian baru dengan items</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <StrukForm defaultBudgetId={budgetId || undefined} />
      </div>
    </div>
  );
}

export default function TambahStrukPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TambahStrukContent />
    </Suspense>
  );
}
