'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pembelianSchema, type PembelianSchema } from '@/schemas/pembelian.schema';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreatePembelian, useUpdatePembelian } from '@/hooks/usePembelian';
import { useItems } from '@/hooks/useItem';
import type { Pembelian } from '@/types/pembelian.types';
import { useRouter } from 'next/navigation';
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PembelianFormProps {
  pembelian?: Pembelian;
  onSuccess?: () => void;
  defaultItemId?: string;
}

export function PembelianForm({ pembelian, onSuccess, defaultItemId }: PembelianFormProps) {
  const router = useRouter();
  const createMutation = useCreatePembelian();
  const updateMutation = useUpdatePembelian();
  const { data: itemsData } = useItems(undefined, undefined, undefined, undefined, 1, 100);
  const [openItem, setOpenItem] = useState(false);

  const form = useForm<PembelianSchema>({
    resolver: zodResolver(pembelianSchema),
    defaultValues: {
      itemId: pembelian?.itemId || defaultItemId || '',
      jumlah: pembelian?.jumlah,
      tanggal: pembelian?.tanggal
        ? format(new Date(pembelian.tanggal), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      supplier: pembelian?.supplier || '',
      hargaSatuan: pembelian?.hargaSatuan,
      keterangan: pembelian?.keterangan || '',
    },
  });

  const onSubmit = async (data: PembelianSchema) => {
    const payload = {
      ...data,
      tanggal: new Date(data.tanggal).toISOString(),
    };

    if (pembelian) {
      updateMutation.mutate(
        { id: pembelian.id, data: payload },
        {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/pembelian');
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
            router.push('/pembelian');
          }
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const watchJumlah = useWatch({ control: form.control, name: 'jumlah' }) || 0;
  const watchHargaSatuan = useWatch({ control: form.control, name: 'hargaSatuan' }) || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="itemId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Item *</FormLabel>
                <Popover open={openItem} onOpenChange={setOpenItem}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!!pembelian}
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? itemsData?.data?.find((item) => item.id === field.value)?.nama
                            || 'Pilih item'
                          : 'Pilih item'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari item..." />
                      <CommandList>
                        <CommandEmpty>Tidak ada item ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {itemsData?.data?.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={`${item.kode} ${item.nama} ${item.kategori}`}
                              onSelect={() => {
                                form.setValue('itemId', item.id);
                                setOpenItem(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === item.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{item.nama}</span>
                                <span className="text-xs text-muted-foreground">
                                  Stok: {item.stokSekarang} {item.satuan}
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
            name="jumlah"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hargaSatuan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Satuan (Rp) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  <Input placeholder="Nama supplier" {...field} />
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

        {/* Total Harga Display */}
        {watchJumlah > 0 && watchHargaSatuan > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-800">Total Harga:</span>
              <span className="text-xl font-bold text-blue-900">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(watchJumlah * watchHargaSatuan)}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pembelian ? 'Simpan Perubahan' : 'Tambah Pembelian'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
