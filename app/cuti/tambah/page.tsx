'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { CutiForm } from '@/components/cuti/CutiForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TambahCutiPage() {
  const router = useRouter();

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
          <h1 className="text-3xl font-bold text-gray-900">Tambah Data Cuti</h1>
          <p className="text-gray-500 mt-1">
            Catat pengajuan cuti karyawan
          </p>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto">
          <CutiForm />
        </div>

        {/* Info Card */}
        <Card className="max-w-3xl mx-auto bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">ℹ️ Informasi Penting</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Cuti Tahunan:</strong> Akan mengurangi saldo cuti tahunan jika status &ldquo;Disetujui&rdquo;
              </li>
              <li>
                <strong>Durasi:</strong> Dihitung otomatis berdasarkan hari kerja (Senin-Jumat)
              </li>
              <li>
                <strong>Validasi Saldo:</strong> Sistem akan memvalidasi ketersediaan saldo untuk cuti tahunan
              </li>
              <li>
                <strong>Jenis Cuti Lain:</strong> Tidak memerlukan saldo cuti tahunan
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
