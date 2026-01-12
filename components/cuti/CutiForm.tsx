'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cutiSchema, type CutiFormData } from '@/schemas/cuti.schema';
import { useCreateCuti } from '@/hooks/useCuti';
import { useKaryawan } from '@/hooks/useKaryawan';
import { useCutiTahunan } from '@/hooks/useCutiTahunan';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { differenceInBusinessDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toISODateTime } from '@/lib/helpers';

export function CutiForm() {
  const router = useRouter();
  const createMutation = useCreateCuti();
  const { data: karyawanList, isLoading: loadingKaryawan } = useKaryawan();
  const [selectedKaryawanId, setSelectedKaryawanId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const { data: cutiTahunanList } = useCutiTahunan({
    karyawanId: selectedKaryawanId || undefined,
    tahun: selectedYear,
  });

  const form = useForm<CutiFormData>({
    resolver: zodResolver(cutiSchema),
    defaultValues: {
      karyawanId: '',
      jenis: 'TAHUNAN',
      tanggalMulai: '',
      tanggalSelesai: '',
      alasan: '',
    },
  });

  const watchKaryawanId = form.watch('karyawanId');
  const watchTanggalMulai = form.watch('tanggalMulai');
  const watchTanggalSelesai = form.watch('tanggalSelesai');
  const watchJenisCuti = form.watch('jenis');

  // Update selected karyawan and year when form value changes
  useEffect(() => {
    if (watchKaryawanId) {
      setSelectedKaryawanId(watchKaryawanId);
      if (watchTanggalMulai) {
        setSelectedYear(new Date(watchTanggalMulai).getFullYear());
      }
    }
  }, [watchKaryawanId, watchTanggalMulai]);

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
      ...data,
      tanggalMulai: toISODateTime(data.tanggalMulai),
      tanggalSelesai: toISODateTime(data.tanggalSelesai),
    };
    
    createMutation.mutate(submitData, {
      onSuccess: () => {
        form.reset();
        router.push('/cuti');
      },
    });
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
                <FormItem>
                  <FormLabel>Karyawan *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih karyawan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingKaryawan && (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      )}
                      {karyawanList?.map((karyawan) => (
                        <SelectItem key={karyawan.id} value={karyawan.id}>
                          {karyawan.nik} - {karyawan.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      Sisa Saldo Cuti Tahun {selectedYear}: {sisaCuti} hari
                    </p>
                    {!isSaldoCukup && duration > 0 && (
                      <p className="text-sm">
                        ⚠️ Durasi cuti ({duration} hari) melebihi sisa saldo!
                      </p>
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
          <Button type="submit" disabled={createMutation.isPending || (watchJenisCuti === 'TAHUNAN' && !isSaldoCukup)}>
            {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Simpan
          </Button>
        </div>
      </form>
    </Form>
  );
}
