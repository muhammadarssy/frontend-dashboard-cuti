'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pengeluaranSchema, type PengeluaranSchema } from '@/schemas/pengeluaran.schema';
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
import { useCreatePengeluaran, useUpdatePengeluaran } from '@/hooks/usePengeluaran';
import { useItems } from '@/hooks/useItem';
import type { Pengeluaran } from '@/types/pengeluaran.types';
import { useRouter } from 'next/navigation';
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PengeluaranFormProps {
  pengeluaran?: Pengeluaran;
  onSuccess?: () => void;
  defaultItemId?: string;
}

export function PengeluaranForm({ pengeluaran, onSuccess, defaultItemId }: PengeluaranFormProps) {
  const router = useRouter();
  const createMutation = useCreatePengeluaran();
  const updateMutation = useUpdatePengeluaran();
  const { data: itemsData } = useItems(undefined, undefined, undefined, undefined, 1, 100);
  const [openItem, setOpenItem] = useState(false);

  const form = useForm<PengeluaranSchema>({
    resolver: zodResolver(pengeluaranSchema),
    defaultValues: {
      itemId: pengeluaran?.itemId || defaultItemId || '',
      jumlah: pengeluaran?.jumlah || 0,
      tanggal: pengeluaran?.tanggal
        ? format(new Date(pengeluaran.tanggal), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      keperluan: pengeluaran?.keperluan || '',
      penerima: pengeluaran?.penerima || '',
      keterangan: pengeluaran?.keterangan || '',
    },
  });

  const onSubmit = async (data: PengeluaranSchema) => {
    const payload = {
      ...data,
      tanggal: new Date(data.tanggal).toISOString(),
    };

    if (pengeluaran) {
      updateMutation.mutate(
        { id: pengeluaran.id, data: payload },
        {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/pengeluaran');
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
            router.push('/pengeluaran');
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
                        disabled={!!pengeluaran}
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? itemsData?.data?.find((item) => item.id === field.value)
                            ? `${itemsData.data.find((item) => item.id === field.value)?.kode} - ${itemsData.data.find((item) => item.id === field.value)?.nama}`
                            : 'Pilih item'
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
                              {item.kode} - {item.nama} ({item.kategori})
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
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keperluan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keperluan *</FormLabel>
                <FormControl>
                  <Input placeholder="Kebutuhan kantor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="penerima"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Penerima</FormLabel>
                <FormControl>
                  <Input placeholder="Nama penerima" {...field} />
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

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pengeluaran ? 'Simpan Perubahan' : 'Tambah Pengeluaran'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
