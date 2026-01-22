'use client';

import { KategoriBudgetForm } from '@/components/kategori-budget/KategoriBudgetForm';

export default function TambahKategoriBudgetPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Kategori Budget</h1>
        <p className="text-muted-foreground">Tambahkan kategori budget (departemen) baru</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <KategoriBudgetForm />
      </div>
    </div>
  );
}
