'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { kategoriBudgetSchema, type KategoriBudgetSchema } from '@/schemas/kategori-budget.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateKategoriBudget, useUpdateKategoriBudget } from '@/hooks/useKategoriBudget';
import type { KategoriBudget } from '@/types/budget.types';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface KategoriBudgetFormProps {
  kategoriBudget?: KategoriBudget;
  onSuccess?: () => void;
}

export function KategoriBudgetForm({ kategoriBudget, onSuccess }: KategoriBudgetFormProps) {
  const router = useRouter();
  const createMutation = useCreateKategoriBudget();
  const updateMutation = useUpdateKategoriBudget();

  const form = useForm<KategoriBudgetSchema>({
    resolver: zodResolver(kategoriBudgetSchema),
    defaultValues: {
      nama: kategoriBudget?.nama || '',
      deskripsi: kategoriBudget?.deskripsi || '',
      isAktif: kategoriBudget?.isAktif ?? true,
    },
  });

  const onSubmit = async (data: KategoriBudgetSchema) => {
    const payload = {
      ...data,
      deskripsi: data.deskripsi || undefined,
    };

    if (kategoriBudget) {
      updateMutation.mutate(
        { id: kategoriBudget.id, data: payload },
        {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/kategori-budget');
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
            router.push('/kategori-budget');
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
                <FormLabel>Nama Kategori *</FormLabel>
                <FormControl>
                  <Input placeholder="Departemen IT" {...field} />
                </FormControl>
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
                  <Textarea placeholder="Kategori untuk departemen IT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {kategoriBudget ? 'Simpan Perubahan' : 'Tambah Kategori'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
