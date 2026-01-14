'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cutiSchema, type CutiFormData } from '@/schemas/cuti.schema';
import { useCreateCuti, useUpdateCuti } from '@/hooks/useCuti';
import { useKaryawan } from '@/hooks/useKaryawan';
import { useCutiTahunan } from '@/hooks/useCutiTahunan';
import type { Cuti } from '@/types/cuti.types';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, AlertCircle, CheckCircle2, Check, ChevronsUpDown } from 'lucide-react';
import { differenceInBusinessDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toISODateTime } from '@/lib/helpers';

interface CutiFormProps {
  cuti?: Cuti;
}

export function CutiForm({ cuti }: CutiFormProps) {
  const router = useRouter();
  const isEditMode = !!cuti;
  const createMutation = useCreateCuti();
  const updateMutation = useUpdateCuti(cuti?.id || '');
  const { data: karyawanData, isLoading: loadingKaryawan } = useKaryawan();
  const karyawanList = karyawanData?.data || [];
  const [openKaryawan, setOpenKaryawan] = useState(false);

  const form = useForm<CutiFormData>({
    resolver: zodResolver(cutiSchema),
    defaultValues: {
      karyawanId: cuti?.karyawanId || '',
      jenis: cuti?.jenis || 'TAHUNAN',
      tanggalMulai: cuti?.tanggalMulai ? cuti.tanggalMulai.split('T')[0] : '',
      tanggalSelesai: cuti?.tanggalSelesai ? cuti.tanggalSelesai.split('T')[0] : '',
      alasan: cuti?.alasan || '',
    },
  });

  const watchKaryawanId = useWatch({ control: form.control, name: 'karyawanId' });
  const watchTanggalMulai = useWatch({ control: form.control, name: 'tanggalMulai' });
  const watchTanggalSelesai = useWatch({ control: form.control, name: 'tanggalSelesai' });
  const watchJenisCuti = useWatch({ control: form.control, name: 'jenis' });
  
  const { data: cutiTahunanList } = useCutiTahunan({
    karyawanId: watchKaryawanId || undefined,
    tahun: watchTanggalMulai ? new Date(watchTanggalMulai).getFullYear() : new Date().getFullYear(),
  });

  // Calculate duration in business days
  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return differenceInBusinessDays(addDays(endDate, 1), startDate);
  };

  const duration = calculateDuration(watchTanggalMulai, watchTanggalSelesai);

  // Get saldo info
  const cutiTahunanInfo = cutiTahunanList && cutiTahunanList.length > 0 ? cutiTahunanList[0] : null;
  const sisaCuti = cutiTahunanInfo?.sisaCuti || 0;
  const isSaldoCukup = watchJenisCuti === 'TAHUNAN' ? sisaCuti >= duration : true;

  const onSubmit = (data: CutiFormData) => {
    // Convert dates to ISO datetime format for API
    const submitData = {
      jenis: data.jenis,
      alasan: data.alasan,
      tanggalMulai: toISODateTime(data.tanggalMulai),
      tanggalSelesai: toISODateTime(data.tanggalSelesai),
    };
    
    if (isEditMode) {
      // Update mode
      updateMutation.mutate(submitData, {
        onSuccess: () => {
          router.push('/cuti');
        },
      });
    } else {
      // Create mode
      const createData = {
        ...submitData,
        karyawanId: data.karyawanId,
      };
      createMutation.mutate(createData, {
        onSuccess: () => {
          form.reset();
          router.push('/cuti');
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Karyawan */}
            <FormField
              control={form.control}
              name="karyawanId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Karyawan *</FormLabel>
                  {isEditMode ? (
                    <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                      <p className="font-medium">{cuti?.karyawan?.nama}</p>
                      <p className="text-sm text-gray-500 font-mono">{cuti?.karyawan?.nik}</p>
                    </div>
                  ) : (
                    <Popover open={openKaryawan} onOpenChange={setOpenKaryawan}>
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
                            ? karyawanList?.find((k) => k.id === field.value)?.nama
                            : 'Pilih karyawan...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Ketik nama karyawan..." />
                        <CommandList>
                          <CommandEmpty>
                            {loadingKaryawan ? 'Loading...' : 'Karyawan tidak ditemukan.'}
                          </CommandEmpty>
                          <CommandGroup>
                            {karyawanList?.map((karyawan) => (
                              <CommandItem
                                key={karyawan.id}
                                value={karyawan.nama}
                                onSelect={() => {
                                  form.setValue('karyawanId', karyawan.id);
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Show saldo info if karyawan selected and jenis TAHUNAN */}
            {watchKaryawanId && watchJenisCuti === 'TAHUNAN' && cutiTahunanInfo && (
              <div className={cn(
                'rounded-lg border p-4',
                isSaldoCukup ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
              )}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={cn('h-5 w-5 mt-0.5', isSaldoCukup ? 'text-green-600' : 'text-orange-600')} />
                  <div className={cn('space-y-1', isSaldoCukup ? 'text-green-800' : 'text-orange-800')}>
                    <p className="font-medium">
                      Sisa Saldo Cuti Tahun {watchTanggalMulai ? new Date(watchTanggalMulai).getFullYear() : new Date().getFullYear()}: {sisaCuti} hari
                    </p>
                    {!isSaldoCukup && duration > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">
                          ⚠️ Durasi cuti ({duration} hari) melebihi sisa saldo!
                        </p>
                        <p className="text-sm">
                          Saldo akan menjadi <span className="font-bold">{sisaCuti - duration} hari</span> (negatif). 
                          Anda tetap bisa melanjutkan dengan konfirmasi.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Jenis Cuti */}
            <FormField
              control={form.control}
              name="jenis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Cuti *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TAHUNAN">Cuti Tahunan</SelectItem>
                      <SelectItem value="SAKIT">Cuti Sakit</SelectItem>
                      <SelectItem value="IZIN">Izin</SelectItem>
                      <SelectItem value="BAKU">Cuti Baku</SelectItem>
                      <SelectItem value="TANPA_KETERANGAN">Tanpa Keterangan</SelectItem>
                      <SelectItem value="LAINNYA">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal Mulai */}
            <FormField
              control={form.control}
              name="tanggalMulai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Mulai *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal Selesai */}
            <FormField
              control={form.control}
              name="tanggalSelesai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Selesai *</FormLabel>
                  <FormControl>
                    <Input type="date" min={watchTanggalMulai} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration Info */}
            {duration > 0 && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-blue-800">
                    <p className="font-medium">Durasi: {duration} hari kerja</p>
                    <p className="text-sm mt-1">
                      (Perhitungan otomatis berdasarkan hari kerja, Sabtu-Minggu tidak dihitung)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Alasan */}
            <FormField
              control={form.control}
              name="alasan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan *</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Masukkan alasan cuti..."
                      className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Maksimal 500 karakter</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push('/cuti')}>
            Batal
          </Button>
          
          {/* Show confirmation dialog if saldo not enough for TAHUNAN */}
          {watchJenisCuti === 'TAHUNAN' && !isSaldoCukup && duration > 0 ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  type="button"
                  disabled={isEditMode ? updateMutation?.isPending : createMutation.isPending}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {(isEditMode ? updateMutation?.isPending : createMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {isEditMode ? 'Update' : 'Simpan'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>⚠️ Saldo Cuti Tidak Mencukupi</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-2">
                      <div>
                        Durasi cuti <strong>{duration} hari</strong> melebihi sisa saldo <strong>{sisaCuti} hari</strong>.
                      </div>
                      <div>
                        Jika dilanjutkan, saldo akan menjadi <strong className="text-orange-600">{sisaCuti - duration} hari (negatif)</strong>.
                      </div>
                      <div className="text-sm text-gray-600">
                        Apakah Anda yakin ingin melanjutkan?
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={form.handleSubmit(onSubmit)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Ya, Lanjutkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button 
              type="submit" 
              disabled={isEditMode ? updateMutation?.isPending : createMutation.isPending}
            >
              {(isEditMode ? updateMutation?.isPending : createMutation.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {isEditMode ? 'Update' : 'Simpan'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
