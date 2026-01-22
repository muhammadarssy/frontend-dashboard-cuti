'use client';

import { use } from 'react';
import { useKategoriBudget } from '@/hooks/useKategoriBudget';
import { KategoriBudgetForm } from '@/components/kategori-budget/KategoriBudgetForm';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function KategoriBudgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: kategoriBudget, isLoading } = useKategoriBudget(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!kategoriBudget) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Kategori budget tidak ditemukan</p>
        <Button variant="outline" onClick={() => router.push('/kategori-budget')} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{kategoriBudget.nama}</h1>
          <p className="text-muted-foreground">Detail dan edit kategori budget</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <KategoriBudgetForm kategoriBudget={kategoriBudget} />
      </div>
    </div>
  );
}
