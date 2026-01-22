'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { useActiveKategoriBudgets } from '@/hooks/useKategoriBudget';
import type { Budget, BudgetRincian } from '@/types/budget.types';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { formatRupiahInput, parseRupiahInput } from '@/lib/helpers';
import { useEffect } from 'react';

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
  const { data: kategoriBudgetsData, isLoading: isLoadingKategori } = useActiveKategoriBudgets();

  const form = useForm<BudgetSchema>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      bulan: budget?.bulan || new Date().getMonth() + 1,
      tahun: budget?.tahun || new Date().getFullYear(),
      rincian:
        budget?.budgetKategori?.map((bk) => ({
          kategoriBudgetId: bk.kategoriBudgetId,
          alokasi: bk.alokasi,
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rincian',
  });

  // Auto-add first kategori if empty and kategori budgets are loaded
  useEffect(() => {
    if (
      !isLoadingKategori &&
      kategoriBudgetsData?.data &&
      kategoriBudgetsData.data.length > 0 &&
      fields.length === 0 &&
      !budget
    ) {
      append({
        kategoriBudgetId: kategoriBudgetsData.data[0].id,
        alokasi: 0,
      });
    }
  }, [isLoadingKategori, kategoriBudgetsData, fields.length, budget, append]);

  const availableKategoriOptions = kategoriBudgetsData?.data || [];
  const usedKategoriIds = form.watch('rincian').map((r) => r.kategoriBudgetId);

  const getTotalAlokasi = () => {
    const rincian = form.watch('rincian');
    return rincian.reduce((sum, r) => sum + (r.alokasi || 0), 0);
  };

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

        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Rincian Budget per Kategori *</FormLabel>
            {availableKategoriOptions.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const unusedKategori = availableKategoriOptions.find(
                    (k) => !usedKategoriIds.includes(k.id)
                  );
                  if (unusedKategori) {
                    append({
                      kategoriBudgetId: unusedKategori.id,
                      alokasi: 0,
                    });
                  }
                }}
                disabled={usedKategoriIds.length >= availableKategoriOptions.length}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Button>
            )}
          </div>

          {isLoadingKategori ? (
            <div className="text-sm text-muted-foreground">Memuat kategori budget...</div>
          ) : availableKategoriOptions.length === 0 ? (
            <div className="text-sm text-amber-600">
              Belum ada kategori budget aktif. Silakan tambah kategori budget terlebih dahulu.
            </div>
          ) : fields.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Belum ada kategori yang ditambahkan. Klik "Tambah Kategori" untuk menambahkan.
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => {
                const currentKategoriId = form.watch(`rincian.${index}.kategoriBudgetId`);
                const availableOptions = availableKategoriOptions.filter(
                  (k) => k.id === currentKategoriId || !usedKategoriIds.includes(k.id)
                );

                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`rincian.${index}.kategoriBudgetId`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-5">
                          <FormLabel>Kategori Budget *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.trigger(`rincian.${index}.kategoriBudgetId`);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableOptions.map((kategori) => (
                                <SelectItem key={kategori.id} value={kategori.id}>
                                  {kategori.nama}
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
                      name={`rincian.${index}.alokasi`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-6">
                          <FormLabel>Alokasi (Rp) *</FormLabel>
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

                    <div className="md:col-span-1 flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Alokasi:</span>
                  <span className="text-lg font-bold">{formatRupiahInput(getTotalAlokasi())}</span>
                </div>
              </div>
            </div>
          )}
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
