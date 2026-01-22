'use client';

import { LabelStrukForm } from '@/components/label-struk/LabelStrukForm';

export default function TambahLabelStrukPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Label Struk</h1>
        <p className="text-muted-foreground">Tambahkan label baru untuk kategorisasi item</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <LabelStrukForm />
      </div>
    </div>
  );
}
