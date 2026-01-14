'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema, type ItemSchema } from '@/schemas/item.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateItem, useUpdateItem } from '@/hooks/useItem';
import type { Item } from '@/types/item.types';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ItemFormProps {
  item?: Item;
  onSuccess?: () => void;
}

export function ItemForm({ item, onSuccess }: ItemFormProps) {
  const router = useRouter();
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();

  const form = useForm<ItemSchema>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      kode: item?.kode || '',
      nama: item?.nama || '',
      kategori: item?.kategori || 'ATK',
      satuan: item?.satuan || '',
      stokMinimal: item?.stokMinimal || 0,
      stokSekarang: item?.stokSekarang || 0,
      keterangan: item?.keterangan || '',
    },
  });

  const onSubmit = async (data: ItemSchema) => {
    if (item) {
      updateMutation.mutate(
        { id: item.id, data },
        {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/item');
            }
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/item');
          }
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="kode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Item *</FormLabel>
                <FormControl>
                  <Input placeholder="ATK001" {...field} disabled={!!item} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Item *</FormLabel>
                <FormControl>
                  <Input placeholder="Pulpen Hitam" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kategori"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ATK">ATK (Alat Tulis Kantor)</SelectItem>
                    <SelectItem value="OBAT">OBAT (Obat-obatan)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="satuan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Satuan *</FormLabel>
                <FormControl>
                  <Input placeholder="pcs / box / rim" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stokMinimal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stok Minimal</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stokSekarang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stok Sekarang</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    disabled={!!item}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="keterangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Input placeholder="Catatan tambahan (opsional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {item ? 'Simpan Perubahan' : 'Tambah Item'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
