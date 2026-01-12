'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { karyawanSchema, type KaryawanFormData } from '@/schemas/karyawan.schema';
import { useCreateKaryawan } from '@/hooks/useKaryawan';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { STATUS_KARYAWAN } from '@/lib/constants';
import { toISODate, toISODateTime } from '@/lib/helpers';

export default function TambahKaryawanPage() {
  const router = useRouter();
  const createMutation = useCreateKaryawan();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<KaryawanFormData>({
    resolver: zodResolver(karyawanSchema),
    defaultValues: {
      tanggalMasuk: toISODate(new Date()),
    },
  });

  const onSubmit = async (data: KaryawanFormData) => {
    // Convert date to ISO datetime format for API
    const submitData = {
      ...data,
      tanggalMasuk: toISODateTime(data.tanggalMasuk),
    };
    await createMutation.mutateAsync(submitData);
    router.push('/karyawan');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/karyawan">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Karyawan</h1>
            <p className="text-gray-500 mt-1">
              Tambahkan data karyawan baru
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Karyawan</CardTitle>
              <CardDescription>
                Lengkapi data karyawan dengan benar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* NIK */}
              <div className="space-y-2">
                <Label htmlFor="nik">NIK *</Label>
                <Input
                  id="nik"
                  {...register('nik')}
                  placeholder="Contoh: KRY001"
                  className={errors.nik ? 'border-red-500' : ''}
                />
                {errors.nik && (
                  <p className="text-sm text-red-600">{errors.nik.message}</p>
                )}
              </div>

              {/* Nama */}
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap *</Label>
                <Input
                  id="nama"
                  {...register('nama')}
                  placeholder="Nama lengkap karyawan"
                  className={errors.nama ? 'border-red-500' : ''}
                />
                {errors.nama && (
                  <p className="text-sm text-red-600">{errors.nama.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Jabatan */}
                <div className="space-y-2">
                  <Label htmlFor="jabatan">Jabatan</Label>
                  <Input
                    id="jabatan"
                    {...register('jabatan')}
                    placeholder="Contoh: Staff IT"
                    className={errors.jabatan ? 'border-red-500' : ''}
                  />
                  {errors.jabatan && (
                    <p className="text-sm text-red-600">{errors.jabatan.message}</p>
                  )}
                </div>

                {/* Departemen */}
                <div className="space-y-2">
                  <Label htmlFor="departemen">Departemen</Label>
                  <Input
                    id="departemen"
                    {...register('departemen')}
                    placeholder="Contoh: IT"
                    className={errors.departemen ? 'border-red-500' : ''}
                  />
                  {errors.departemen && (
                    <p className="text-sm text-red-600">{errors.departemen.message}</p>
                  )}
                </div>

                {/* Tanggal Masuk */}
                <div className="space-y-2">
                  <Label htmlFor="tanggalMasuk">Tanggal Masuk *</Label>
                  <Input
                    id="tanggalMasuk"
                    type="date"
                    {...register('tanggalMasuk')}
                    className={errors.tanggalMasuk ? 'border-red-500' : ''}
                  />
                  {errors.tanggalMasuk && (
                    <p className="text-sm text-red-600">{errors.tanggalMasuk.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <Link href="/karyawan">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
