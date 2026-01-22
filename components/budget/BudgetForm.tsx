'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetSchema, type BudgetSchema } from '@/schemas/budget.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateBudget, useUpdateBudget } from '@/hooks/useBudget';
import type { Budget } from '@/types/budget.types';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { formatRupiahInput, parseRupiahInput } from '@/lib/helpers';

interface BudgetFormProps {
  budget?: Budget;
  onSuccess?: () => void;
}

const bulanOptions = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
];

export function BudgetForm({ budget, onSuccess }: BudgetFormProps) {
  const router = useRouter();
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();

  const form = useForm<BudgetSchema>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      bulan: budget?.bulan || new Date().getMonth() + 1,
      tahun: budget?.tahun || new Date().getFullYear(),
      totalBudget: budget?.totalBudget,
    },
  });

  const onSubmit = async (data: BudgetSchema) => {
    if (budget) {
      updateMutation.mutate(
        { id: budget.id, data },
        {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/budget');
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
            router.push('/budget');
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
            name="bulan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bulan *</FormLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                  disabled={!!budget}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bulan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bulanOptions.map((bulan) => (
                      <SelectItem key={bulan.value} value={String(bulan.value)}>
                        {bulan.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tahun"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2026"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    disabled={!!budget}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Budget (Rp) *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Rp. 0"
                    value={formatRupiahInput(field.value)}
                    onChange={(e) => {
                      const parsed = parseRupiahInput(e.target.value);
                      field.onChange(parsed);
                    }}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {budget ? 'Simpan Perubahan' : 'Tambah Budget'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
