'use client';

import { BudgetForm } from '@/components/budget/BudgetForm';

export default function TambahBudgetPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Budget</h1>
        <p className="text-muted-foreground">Tambahkan budget baru untuk bulan dan tahun tertentu</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <BudgetForm />
      </div>
    </div>
  );
}
