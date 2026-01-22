'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { labelStrukSchema, type LabelStrukSchema } from '@/schemas/label-struk.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateLabelStruk, useUpdateLabelStruk } from '@/hooks/useLabelStruk';
import type { LabelStruk } from '@/types/budget.types';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface LabelStrukFormProps {
  labelStruk?: LabelStruk;
  onSuccess?: () => void;
}

export function LabelStrukForm({ labelStruk, onSuccess }: LabelStrukFormProps) {
  const router = useRouter();
  const createMutation = useCreateLabelStruk();
  const updateMutation = useUpdateLabelStruk();

  const form = useForm<LabelStrukSchema>({
    resolver: zodResolver(labelStrukSchema),
    defaultValues: {
      nama: labelStruk?.nama || '',
      deskripsi: labelStruk?.deskripsi || '',
      warna: labelStruk?.warna || '',
      isAktif: labelStruk?.isAktif ?? true,
    },
  });

  const onSubmit = async (data: LabelStrukSchema) => {
    const payload = {
      ...data,
      deskripsi: data.deskripsi || undefined,
      warna: data.warna || undefined,
    };

    if (labelStruk) {
      updateMutation.mutate(
        { id: labelStruk.id, data: payload },
        {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/label-struk');
            }
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/label-struk');
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
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Label *</FormLabel>
                <FormControl>
                  <Input placeholder="Food and Drink" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="warna"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warna (Hex)</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input placeholder="#FF5733" {...field} />
                    {field.value && (
                      <div
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: field.value }}
                      />
                    )}
                  </div>
                </FormControl>
                <FormDescription>Format: #FF5733 atau #F53</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deskripsi"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea placeholder="Makanan dan minuman" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {labelStruk ? 'Simpan Perubahan' : 'Tambah Label'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
