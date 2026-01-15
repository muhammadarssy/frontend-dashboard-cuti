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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { karyawanSchema, type KaryawanFormData } from '@/schemas/karyawan.schema';
import { useKaryawanById, useUpdateKaryawan, useDeactivateKaryawan } from '@/hooks/useKaryawan';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toISODate, toISODateTime } from '@/lib/helpers';

export default function EditKaryawanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: karyawan, isLoading } = useKaryawanById(id);
  const updateMutation = useUpdateKaryawan();
  const deactivateMutation = useDeactivateKaryawan();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<KaryawanFormData>({
    resolver: zodResolver(karyawanSchema),
    values: karyawan
      ? {
          nik: karyawan.nik,
          nama: karyawan.nama,
          jabatan: karyawan.jabatan || undefined,
          departemen: karyawan.departemen || undefined,
          tanggalMasuk: toISODate(new Date(karyawan.tanggalMasuk)),
          fingerprintId: karyawan.fingerprintId || undefined,
        }
      : undefined,
  });

  const onSubmit = async (data: KaryawanFormData) => {
    const submitData = {
      ...data,
      tanggalMasuk: toISODateTime(data.tanggalMasuk),
      fingerprintId: data.fingerprintId === '' ? undefined : data.fingerprintId,
    };
    await updateMutation.mutateAsync({ id, data: submitData });
    router.push(`/karyawan/${id}`);
  };

  const handleDelete = async () => {
    await deactivateMutation.mutateAsync(id);
    router.push('/karyawan');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-8">
          <p className="text-center text-gray-500">Memuat data...</p>
        </div>
      </MainLayout>
    );
  }

  if (!karyawan) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Karyawan tidak ditemukan</p>
          <Button className="mt-4" onClick={() => router.push('/karyawan')}>
            Kembali ke Daftar
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/karyawan/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Karyawan</h1>
            <p className="text-gray-500 mt-1">
              Ubah data karyawan {karyawan.nama}
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

              {/* Fingerprint ID */}
              <div className="space-y-2">
                <Label htmlFor="fingerprintId">Fingerprint ID</Label>
                <Input
                  id="fingerprintId"
                  type="number"
                  {...register('fingerprintId', { valueAsNumber: true })}
                  placeholder="ID dari mesin fingerprint (opsional)"
                  className={errors.fingerprintId ? 'border-red-500' : ''}
                />
                {errors.fingerprintId && (
                  <p className="text-sm text-red-600">{errors.fingerprintId.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Digunakan untuk matching otomatis saat upload absensi fingerprint
                </p>
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
          <div className="flex justify-between mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Karyawan
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Karyawan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Data karyawan <strong>{karyawan.nama}</strong> (NIK: {karyawan.nik}) akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-4">
              <Link href={`/karyawan/${id}`}>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting || updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
