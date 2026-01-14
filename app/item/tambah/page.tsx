'use client';

import { ItemForm } from '@/components/item/ItemForm';

export default function TambahItemPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Item Baru</h1>
        <p className="text-muted-foreground">Tambahkan item ATK atau Obat baru ke sistem</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <ItemForm />
      </div>
    </div>
  );
}
