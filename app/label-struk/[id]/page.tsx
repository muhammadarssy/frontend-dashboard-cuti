'use client';

import { use } from 'react';
import { useLabelStruk } from '@/hooks/useLabelStruk';
import { LabelStrukForm } from '@/components/label-struk/LabelStrukForm';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function LabelStrukDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: labelStruk, isLoading } = useLabelStruk(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!labelStruk) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Label tidak ditemukan</p>
        <Button variant="outline" onClick={() => router.push('/label-struk')} className="mt-4">
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
          <h1 className="text-3xl font-bold">{labelStruk.nama}</h1>
          <p className="text-muted-foreground">Detail dan edit label struk</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <LabelStrukForm labelStruk={labelStruk} />
      </div>
    </div>
  );
}
