'use client';

import * as React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateAbsensiSchema, type UpdateAbsensiFormData } from '@/schemas/absensi.schema';
import { useAbsensiById, useUpdateAbsensi, useDeleteAbsensi } from '@/hooks/useAbsensi';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, AlertCircle, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/helpers';
import { STATUS_KEHADIRAN_LABELS, STATUS_KEHADIRAN_COLORS } from '@/lib/constants';
import { useState } from 'react';

export default function AbsensiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const absensiId = resolvedParams.id;
  const { data: absensi, isLoading } = useAbsensiById(absensiId);
  const updateMutation = useUpdateAbsensi(absensiId);
  const deleteMutation = useDeleteAbsensi();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateAbsensiFormData>({
    resolver: zodResolver(updateAbsensiSchema),
    values: absensi
      ? {
          statusKehadiran: absensi.statusKehadiran,
          keterangan: absensi.keterangan || undefined,
          diinputOleh: absensi.diinputOleh || undefined,
        }
      : undefined,
  });

  const onSubmit = async (data: UpdateAbsensiFormData) => {
    await updateMutation.mutateAsync(data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(absensiId);
    router.push('/absensi');
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

  if (!absensi) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Data absensi tidak ditemukan</AlertDescription>
          </Alert>
          <Link href="/absensi">
            <Button className="mt-4">Kembali ke Daftar</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const statusColors = STATUS_KEHADIRAN_COLORS[absensi.statusKehadiran];
  const allStatuses = ['HADIR', 'SAKIT', 'IZIN', 'WFH', 'TANPA_KETERANGAN', 'CUTI', 'CUTI_BAKU', 'SATPAM', 'TUGAS'] as const;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/absensi">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detail Absensi</h1>
              <p className="text-gray-500 mt-1">Informasi lengkap data absensi</p>
            </div>
          </div>
          {!isEditing && absensi.isManual && (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>

        {/* Warning for Fingerprint Data */}
        {!absensi.isManual && (
          <Alert>
            <Fingerprint className="h-4 w-4" />
            <AlertDescription>
              Data ini berasal dari fingerprint dan tidak dapat diedit. Hanya data manual yang bisa diubah.
            </AlertDescription>
          </Alert>
        )}

        {/* Detail View */}
        {!isEditing ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informasi Absensi</CardTitle>
                <Badge className={statusColors}>
                  {STATUS_KEHADIRAN_LABELS[absensi.statusKehadiran]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Karyawan Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-gray-500">Nama Karyawan</Label>
                  <p className="font-medium text-lg">{absensi.karyawan.nama}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">NIK</Label>
                  <p className="font-medium">{absensi.karyawan.nik}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Jabatan</Label>
                  <p className="font-medium">{absensi.karyawan.jabatan || '-'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Tanggal</Label>
                  <p className="font-medium">{formatDate(absensi.tanggal)}</p>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={absensi.isManual ? 'secondary' : 'default'}>
                    {absensi.isManual ? 'Manual Input' : 'Fingerprint'}
                  </Badge>
                </div>

                {absensi.keterangan && (
                  <div className="space-y-1">
                    <Label className="text-gray-500">Keterangan</Label>
                    <p className="text-gray-700 whitespace-pre-wrap">{absensi.keterangan}</p>
                  </div>
                )}

                {absensi.diinputOleh && (
                  <div className="space-y-1">
                    <Label className="text-gray-500">Diinput Oleh</Label>
                    <p className="font-medium">{absensi.diinputOleh}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Dibuat:</span>{' '}
                    {formatDate(absensi.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Diupdate:</span>{' '}
                    {formatDate(absensi.updatedAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Edit Absensi</CardTitle>
                <CardDescription>Ubah data absensi manual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Read-only Info */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <strong>Karyawan:</strong> {absensi.karyawan.nama} ({absensi.karyawan.nik})
                  </p>
                  <p className="text-sm">
                    <strong>Tanggal:</strong> {formatDate(absensi.tanggal)}
                  </p>
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
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {allStatuses.map((status: typeof allStatuses[number]) => (
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
                </div>

                {/* Keterangan */}
                <div className="space-y-2">
                  <Label htmlFor="keterangan">Keterangan</Label>
                  <Textarea
                    id="keterangan"
                    placeholder="Masukkan keterangan"
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
                  <Label htmlFor="diinputOleh">Diinput Oleh</Label>
                  <Input
                    id="diinputOleh"
                    placeholder="Nama petugas"
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
            <div className="flex justify-between mt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Absensi?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Data absensi untuk <strong>{absensi.karyawan.nama}</strong> pada tanggal{' '}
                      <strong>{formatDate(absensi.tanggal)}</strong> akan dihapus permanen.
                      Tindakan ini tidak dapat dibatalkan.
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
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting || updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Delete Button (View Mode) */}
        {!isEditing && absensi.isManual && (
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Absensi?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Data absensi untuk <strong>{absensi.karyawan.nama}</strong> pada tanggal{' '}
                    <strong>{formatDate(absensi.tanggal)}</strong> akan dihapus permanen.
                    Tindakan ini tidak dapat dibatalkan.
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
          </div>
        )}
      </div>
    </MainLayout>
  );
}
