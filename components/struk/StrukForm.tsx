'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { strukSchema, type StrukSchema, type StrukItemSchema } from '@/schemas/struk.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateStruk, useUpdateStruk } from '@/hooks/useStruk';
import { useBudgets } from '@/hooks/useBudget';
import { useActiveLabelStruks } from '@/hooks/useLabelStruk';
import { useActiveKategoriBudgets } from '@/hooks/useKategoriBudget';
import { useItems } from '@/hooks/useItem';
import type { Struk, StrukItemFormData } from '@/types/budget.types';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { formatRupiahInput, parseRupiahInput } from '@/lib/helpers';

interface StrukFormProps {
  struk?: Struk;
  onSuccess?: () => void;
  defaultBudgetId?: string;
}

const bulanNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function StrukForm({ struk, onSuccess, defaultBudgetId }: StrukFormProps) {
  const router = useRouter();
  const createMutation = useCreateStruk();
  const updateMutation = useUpdateStruk();
  const { data: budgetsData } = useBudgets(undefined, 1, 100);
  const { data: labelsData } = useActiveLabelStruks();
  const { data: kategoriBudgetsData } = useActiveKategoriBudgets();
  const { data: itemsData } = useItems(undefined, undefined, undefined, undefined, 1, 100);

  const [openBudget, setOpenBudget] = useState(false);
  const [openLabels, setOpenLabels] = useState<Record<number, boolean>>({});
  const [openKategori, setOpenKategori] = useState<Record<number, boolean>>({});
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const form = useForm<StrukSchema>({
    resolver: zodResolver(strukSchema),
    defaultValues: {
      budgetId: struk?.budgetId || defaultBudgetId || '',
      tanggal: struk?.tanggal
        ? format(new Date(struk.tanggal), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      nomorStruk: struk?.nomorStruk || '',
      fileBukti: struk?.fileBukti || '',
      namaFileAsli: struk?.namaFileAsli || '',
      items:
        struk?.strukItem?.map((item) => ({
          labelStrukId: item.labelStrukId,
          kategoriBudgetId: item.kategoriBudgetId,
          namaItem: item.namaItem,
          itemId: item.itemId || '',
          harga: item.harga,
          qty: item.qty,
          discountType: item.discountType,
          discountValue: item.discountValue,
          keterangan: item.keterangan || '',
        })) || [],
      taxPersen: struk?.taxPersen,
      taxNominal: struk?.taxNominal,
      keterangan: struk?.keterangan || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchItems = form.watch('items');
  const watchTaxPersen = form.watch('taxPersen');
  const watchTaxNominal = form.watch('taxNominal');

  // Calculate totals
  const calculateTotals = () => {
    let totalHarga = 0;
    let totalDiscount = 0;

    watchItems.forEach((item) => {
      const subtotal = item.harga * item.qty;
      let discountNominal = 0;

      if (item.discountType && item.discountValue !== undefined) {
        if (item.discountType === 'BONUS') {
          discountNominal = item.discountValue;
        } else if (item.discountType === 'PERSEN') {
          discountNominal = (subtotal * item.discountValue) / 100;
        }
      }

      totalHarga += subtotal;
      totalDiscount += discountNominal;
    });

    const totalSetelahDiscount = totalHarga - totalDiscount;
    let taxNominal = 0;

    if (watchTaxPersen !== undefined && watchTaxPersen !== null) {
      taxNominal = (totalSetelahDiscount * watchTaxPersen) / 100;
    } else if (watchTaxNominal !== undefined && watchTaxNominal !== null) {
      taxNominal = watchTaxNominal;
    }

    const totalSetelahTax = totalSetelahDiscount + taxNominal;

    return {
      totalHarga,
      totalDiscount,
      taxNominal,
      totalSetelahTax,
    };
  };

  const totals = calculateTotals();

  const onSubmit = async (data: StrukSchema) => {
    const payload = {
      ...data,
      tanggal: new Date(data.tanggal).toISOString(),
      items: data.items.map((item) => ({
        ...item,
        itemId: item.itemId || undefined,
        keterangan: item.keterangan || undefined,
      })),
      nomorStruk: data.nomorStruk || undefined,
      fileBukti: data.fileBukti || undefined,
      namaFileAsli: data.namaFileAsli || undefined,
      taxPersen: data.taxPersen || undefined,
      taxNominal: data.taxNominal || undefined,
      keterangan: data.keterangan || undefined,
    };

    if (struk) {
      updateMutation.mutate(
        { id: struk.id, data: payload },
        {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/struk');
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
            router.push('/struk');
          }
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const addItem = () => {
    append({
      labelStrukId: '',
      kategoriBudgetId: '',
      namaItem: '',
      itemId: '',
      harga: 0,
      qty: 1,
      discountType: undefined,
      discountValue: undefined,
      keterangan: '',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="budgetId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Budget *</FormLabel>
                <Popover open={openBudget} onOpenChange={setOpenBudget}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!!struk}
                        className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                      >
                        {field.value
                          ? budgetsData?.data?.find((b) => b.id === field.value)
                            ? `${bulanNames[budgetsData.data.find((b) => b.id === field.value)!.bulan - 1]} ${budgetsData.data.find((b) => b.id === field.value)!.tahun}`
                            : 'Pilih budget'
                          : 'Pilih budget'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari budget..." />
                      <CommandList>
                        <CommandEmpty>Tidak ada budget ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {budgetsData?.data?.map((budget) => (
                            <CommandItem
                              key={budget.id}
                              value={`${bulanNames[budget.bulan - 1]} ${budget.tahun}`}
                              onSelect={() => {
                                form.setValue('budgetId', budget.id);
                                setOpenBudget(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === budget.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              <div className="flex flex-col">
                                <span>
                                  {bulanNames[budget.bulan - 1]} {budget.tahun}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Budget: {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                  }).format(budget.totalBudget)}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tanggal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nomorStruk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Struk</FormLabel>
                <FormControl>
                  <Input placeholder="STR-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keterangan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keterangan</FormLabel>
                <FormControl>
                  <Input placeholder="Catatan tambahan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Item
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Item {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.labelStrukId`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Label *</FormLabel>
                      <Popover
                        open={openLabels[index] || false}
                        onOpenChange={(open) => setOpenLabels({ ...openLabels, [index]: open })}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? labelsData?.data?.find((l) => l.id === field.value)?.nama ||
                                  'Pilih label'
                                : 'Pilih label'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Cari label..." />
                            <CommandList>
                              <CommandEmpty>Tidak ada label ditemukan.</CommandEmpty>
                              <CommandGroup>
                                {labelsData?.data?.map((label) => (
                                  <CommandItem
                                    key={label.id}
                                    value={label.nama}
                                    onSelect={() => {
                                      form.setValue(`items.${index}.labelStrukId`, label.id);
                                      setOpenLabels({ ...openLabels, [index]: false });
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value === label.id ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    <div className="flex items-center gap-2">
                                      {label.warna && (
                                        <div
                                          className="w-4 h-4 rounded"
                                          style={{ backgroundColor: label.warna }}
                                        />
                                      )}
                                      <span>{label.nama}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.kategoriBudgetId`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Kategori Budget *</FormLabel>
                      <Popover
                        open={openKategori[index] || false}
                        onOpenChange={(open) => setOpenKategori({ ...openKategori, [index]: open })}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? kategoriBudgetsData?.data?.find((k) => k.id === field.value)
                                    ?.nama || 'Pilih kategori'
                                : 'Pilih kategori'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Cari kategori..." />
                            <CommandList>
                              <CommandEmpty>Tidak ada kategori ditemukan.</CommandEmpty>
                              <CommandGroup>
                                {kategoriBudgetsData?.data?.map((kategori) => (
                                  <CommandItem
                                    key={kategori.id}
                                    value={kategori.nama}
                                    onSelect={() => {
                                      form.setValue(`items.${index}.kategoriBudgetId`, kategori.id);
                                      setOpenKategori({ ...openKategori, [index]: false });
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value === kategori.id ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    <span>{kategori.nama}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.namaItem`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Item *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nasi Goreng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.harga`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga (Rp) *</FormLabel>
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

                <FormField
                  control={form.control}
                  name={`items.${index}.qty`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qty *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.discountType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Discount</FormLabel>
                      <Select
                        value={field.value || 'none'}
                        onValueChange={(value) => {
                          if (value === 'none') {
                            field.onChange(undefined);
                            form.setValue(`items.${index}.discountValue`, undefined);
                          } else {
                            field.onChange(value as 'BONUS' | 'PERSEN');
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe discount" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Tidak ada discount</SelectItem>
                          <SelectItem value="BONUS">Bonus (Nominal)</SelectItem>
                          <SelectItem value="PERSEN">Persen (%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchItems[index]?.discountType && (
                  <FormField
                    control={form.control}
                    name={`items.${index}.discountValue`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount Value{' '}
                          {watchItems[index]?.discountType === 'PERSEN' ? '(%)' : '(Rp)'} *
                        </FormLabel>
                        <FormControl>
                          {watchItems[index]?.discountType === 'BONUS' ? (
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
                          ) : (
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === '' ? undefined : Number(e.target.value)
                                )
                              }
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`items.${index}.keterangan`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Keterangan</FormLabel>
                      <FormControl>
                        <Input placeholder="Catatan item" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Item Summary */}
              {watchItems[index] && watchItems[index].harga > 0 && watchItems[index].qty > 0 && (
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(watchItems[index].harga * watchItems[index].qty)}
                    </span>
                  </div>
                  {watchItems[index].discountType && watchItems[index].discountValue !== undefined && (
                    <>
                      <div className="flex justify-between text-red-600">
                        <span>Discount:</span>
                        <span>
                          -{' '}
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(
                            watchItems[index].discountType === 'BONUS'
                              ? watchItems[index].discountValue
                              : (watchItems[index].harga *
                                  watchItems[index].qty *
                                  watchItems[index].discountValue) /
                                  100
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(
                            watchItems[index].harga * watchItems[index].qty -
                              (watchItems[index].discountType === 'BONUS'
                                ? watchItems[index].discountValue
                                : (watchItems[index].harga *
                                    watchItems[index].qty *
                                    watchItems[index].discountValue) /
                                  100)
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tax Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
          <FormField
            control={form.control}
            name="taxPersen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Persen (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : Number(e.target.value);
                      field.onChange(value);
                      if (value !== undefined) {
                        form.setValue('taxNominal', undefined);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxNominal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Nominal (Rp)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Rp. 0"
                    value={formatRupiahInput(field.value)}
                    onChange={(e) => {
                      const parsed = parseRupiahInput(e.target.value);
                      field.onChange(parsed);
                      if (parsed !== undefined) {
                        form.setValue('taxPersen', undefined);
                      }
                    }}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Total Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-blue-800">Total Harga:</span>
            <span className="text-sm font-medium text-blue-900">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(totals.totalHarga)}
            </span>
          </div>
          {totals.totalDiscount > 0 && (
            <div className="flex justify-between text-red-600">
              <span className="text-sm font-medium">Total Discount:</span>
              <span className="text-sm font-medium">
                -{' '}
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(totals.totalDiscount)}
              </span>
            </div>
          )}
          {totals.taxNominal > 0 && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-blue-800">Tax:</span>
              <span className="text-sm font-medium text-blue-900">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(totals.taxNominal)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-blue-300 pt-2">
            <span className="text-lg font-bold text-blue-900">Total Setelah Tax:</span>
            <span className="text-lg font-bold text-blue-900">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(totals.totalSetelahTax)}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {struk ? 'Simpan Perubahan' : 'Tambah Struk'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
