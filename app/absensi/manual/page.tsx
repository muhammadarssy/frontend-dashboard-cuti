'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { absensiManualSchema, type AbsensiManualFormData } from '@/schemas/absensi.schema';
import { useCreateAbsensiManual } from '@/hooks/useAbsensi';
import { useKaryawan } from '@/hooks/useKaryawan';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Check, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { toISODate } from '@/lib/helpers';
import { STATUS_KEHADIRAN_LABELS } from '@/lib/constants';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ManualAbsensiPage() {
  const router = useRouter();
  const createMutation = useCreateAbsensiManual();
  const { data: karyawanData } = useKaryawan({});
  const karyawanList = karyawanData?.data || [];
  const [openKaryawan, setOpenKaryawan] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AbsensiManualFormData>({
    resolver: zodResolver(absensiManualSchema),
    defaultValues: {
      tanggal: toISODate(new Date()),
    },
  });

  const onSubmit = async (data: AbsensiManualFormData) => {
    // Convert to required format with ISO date
    const payload = {
      ...data,
      tanggal: new Date(data.tanggal).toISOString(),
    };
    
    await createMutation.mutateAsync(payload);
    router.push('/absensi');
  };

  // Filter status for manual input (exclude HADIR)
  const manualStatuses = [
    'SAKIT',
    'IZIN',
    'WFH',
    'TANPA_KETERANGAN',
    'CUTI',
    'CUTI_BAKU',
    'SATPAM',
    'TUGAS',
  ] as const;


  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/absensi">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Input Absensi Manual</h1>
            <p className="text-gray-500 mt-1">
              Input absensi untuk karyawan sakit, izin, WFH, atau tanpa keterangan
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Data Absensi</CardTitle>
              <CardDescription>Isi semua informasi yang diperlukan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Karyawan */}
              <div className="space-y-2">
                <Label htmlFor="karyawanId">Karyawan *</Label>
                <Controller
                  name="karyawanId"
                  control={control}
                  render={({ field }) => (
                    <Popover open={openKaryawan} onOpenChange={setOpenKaryawan}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                            errors.karyawanId && 'border-red-500'
                          )}
                        >
                          {field.value
                            ? karyawanList?.find((k) => k.id === field.value)?.nama
                            : 'Pilih karyawan...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Ketik nama karyawan..." />
                          <CommandList>
                            <CommandEmpty>Karyawan tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {karyawanList?.map((karyawan) => (
                                <CommandItem
                                  key={karyawan.id}
                                  value={karyawan.nama}
                                  onSelect={() => {
                                    field.onChange(karyawan.id);
                                    setOpenKaryawan(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      karyawan.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {karyawan.nama}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.karyawanId && (
                  <p className="text-sm text-red-600">{errors.karyawanId.message}</p>
                )}
              </div>

              {/* Tanggal */}
              <div className="space-y-2">
                <Label htmlFor="tanggal">Tanggal *</Label>
                <Input
                  id="tanggal"
                  type="date"
                  {...register('tanggal')}
                  className={errors.tanggal ? 'border-red-500' : ''}
                />
                {errors.tanggal && (
                  <p className="text-sm text-red-600">{errors.tanggal.message}</p>
                )}
              </div>

              {/* Status Kehadiran */}
              <div className="space-y-2">
                <Label htmlFor="statusKehadiran">Status Kehadiran *</Label>
                <Controller
                  name="statusKehadiran"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.statusKehadiran ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        {manualStatuses.map((status: typeof manualStatuses[number]) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_KEHADIRAN_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.statusKehadiran && (
                  <p className="text-sm text-red-600">{errors.statusKehadiran.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Status &quot;Hadir&quot; hanya bisa diinput melalui upload fingerprint
                </p>
              </div>

              {/* Keterangan */}
              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                  id="keterangan"
                  placeholder="Masukkan keterangan tambahan (opsional)"
                  rows={4}
                  {...register('keterangan')}
                  className={errors.keterangan ? 'border-red-500' : ''}
                />
                {errors.keterangan && (
                  <p className="text-sm text-red-600">{errors.keterangan.message}</p>
                )}
              </div>

              {/* Diinput Oleh */}
              <div className="space-y-2">
                <Label htmlFor="diinputOleh">Diinput Oleh *</Label>
                <Input
                  id="diinputOleh"
                  placeholder="Nama petugas yang menginput"
                  {...register('diinputOleh')}
                  className={errors.diinputOleh ? 'border-red-500' : ''}
                />
                {errors.diinputOleh && (
                  <p className="text-sm text-red-600">{errors.diinputOleh.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <Link href="/absensi">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting || createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
