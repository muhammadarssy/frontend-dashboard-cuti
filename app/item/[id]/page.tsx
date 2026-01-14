'use client';

import { useItem } from '@/hooks/useItem';
import { ItemForm } from '@/components/item/ItemForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditItemPage({ params }: { params: { id: string } }) {
  const { data: item, isLoading } = useItem(params.id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800">Item tidak ditemukan</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Item</h1>
        <p className="text-muted-foreground">Perbarui informasi item {item.nama}</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <ItemForm item={item} />
      </div>
    </div>
  );
}
