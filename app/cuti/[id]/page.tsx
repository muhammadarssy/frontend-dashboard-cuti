'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { CutiForm } from '@/components/cuti/CutiForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useCutiById } from '@/hooks/useCuti';

export default function EditCutiPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: cuti, isLoading, error } = useCutiById(id);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  if (error || !cuti) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/cuti')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">Data cuti tidak ditemukan</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/cuti')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Data Cuti</h1>
          <p className="text-gray-500 mt-1">
            Ubah data cuti karyawan
          </p>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto">
          <CutiForm cuti={cuti} />
        </div>

        {/* Info Card */}
        <Card className="max-w-3xl mx-auto bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">ℹ️ Informasi Penting</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Perubahan Tanggal:</strong> Durasi akan dihitung ulang otomatis
              </li>
              <li>
                <strong>Perubahan Jenis:</strong> Saldo cuti akan disesuaikan jika berubah dari/ke Cuti Tahunan
              </li>
              <li>
                <strong>Saldo:</strong> Saldo lama akan dikembalikan dan saldo baru akan dipotong
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
