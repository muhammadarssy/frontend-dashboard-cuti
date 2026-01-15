'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadFingerprintSchema, type UploadFingerprintFormData } from '@/schemas/absensi.schema';
import { useUploadFingerprint, useKaryawanBelumAbsen, useBulkCreateAbsensiManual } from '@/hooks/useAbsensi';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { toISODate } from '@/lib/helpers';
import { useState } from 'react';

export default function UploadFingerprintPage() {
  const router = useRouter();
  const uploadMutation = useUploadFingerprint();
  const bulkCreateMutation = useBulkCreateAbsensiManual();
  
  const [uploadResult, setUploadResult] = useState<{
    success: number;
    failed: number;
    notFound: number;
    duplicate: number;
    details: {
      notMatched: Array<{ id: number; nama: string }>;
    };
    missingEmployees: Array<{
      id: string;
      nama: string;
      nik: string;
      jabatan: string | null;
      fingerprintId: number | null;
    }>;
  } | null>(null);
  
  // State untuk form data per karyawan
  const [formData, setFormData] = useState<Record<string, {
    statusKehadiran: string;
    keterangan: string;
  }>>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<UploadFingerprintFormData>({
    resolver: zodResolver(uploadFingerprintSchema),
    defaultValues: {
      tanggal: toISODate(new Date()),
    },
  });

  const tanggal = watch('tanggal');
  const { data: belumAbsenData } = useKaryawanBelumAbsen(
    tanggal ? new Date(tanggal).toISOString() : ''
  );

  const onSubmit = async (data: UploadFingerprintFormData) => {
    const file = data.file;
    const tanggalISO = new Date(data.tanggal).toISOString();
    
    const result = await uploadMutation.mutateAsync({ file, tanggal: tanggalISO });
    if (result) {
      setUploadResult(result);
      setFormData({}); // Reset form data
    }
  };

  const handleBulkSubmit = async () => {
    // Filter hanya yang sudah diisi statusnya
    const filledData = Object.entries(formData).filter(([, data]) => data.statusKehadiran);
    
    if (filledData.length === 0) {
      return;
    }

    // Group by status dan keterangan yang sama untuk optimize request
    const grouped = filledData.reduce((acc, [karyawanId, data]) => {
      const key = `${data.statusKehadiran}|${data.keterangan}`;
      if (!acc[key]) {
        acc[key] = {
          statusKehadiran: data.statusKehadiran,
          keterangan: data.keterangan,
          karyawanIds: [],
        };
      }
      acc[key].karyawanIds.push(karyawanId);
      return acc;
    }, {} as Record<string, { statusKehadiran: string; keterangan: string; karyawanIds: string[] }>);

    // Submit each group
    for (const group of Object.values(grouped)) {
      await bulkCreateMutation.mutateAsync({
        karyawanIds: group.karyawanIds,
        tanggal: new Date(tanggal).toISOString(),
        statusKehadiran: group.statusKehadiran,
        keterangan: group.keterangan || undefined,
      });
    }

    // Remove successfully created from list and reset form
    const submittedIds = new Set(filledData.map(([id]) => id));
    setUploadResult(prev => prev ? {
      ...prev,
      missingEmployees: prev.missingEmployees.filter(k => !submittedIds.has(k.id))
    } : null);
    setFormData({});
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/absensi">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Fingerprint</h1>
            <p className="text-gray-500 mt-1">Upload data absensi dari mesin fingerprint</p>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <FileSpreadsheet className="h-4 w-4" />
          <AlertDescription>
            <strong>Format File:</strong> Excel (.xls atau .xlsx) dari mesin fingerprint.
            <br />
            Kolom yang diperlukan: <code>No. ID</code>, <code>NIK</code>, <code>Nama</code>, <code>Waktu</code>, <code>Status</code>
          </AlertDescription>
        </Alert>

        {/* 2 Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* COLUMN 1: Upload Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="h-[500px] flex flex-col">
              <CardHeader>
                <CardTitle>Upload File Excel</CardTitle>
                <CardDescription>Pilih tanggal dan file Excel fingerprint</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-6">
                {/* Tanggal */}
                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal Absensi *</Label>
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

                {/* File Input */}
                <div className="space-y-2">
                  <Label htmlFor="file">File Excel *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setValue('file', file);
                      }
                    }}
                    className={errors.file ? 'border-red-500' : ''}
                  />
                  {errors.file && (
                    <p className="text-sm text-red-600">{errors.file.message as string}</p>
                  )}
                  <p className="text-xs text-gray-500">Maksimal ukuran file: 5MB</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4">
                  <Link href="/absensi">
                    <Button type="button" variant="outline">
                      Batal
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting || uploadMutation.isPending}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isSubmitting || uploadMutation.isPending ? 'Mengupload...' : 'Upload'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* COLUMN 2: Upload Results */}
          {uploadResult && (
            <Card className="h-[500px] flex flex-col">
              <CardHeader>
                <CardTitle>Hasil Upload</CardTitle>
                <CardDescription>Ringkasan proses upload fingerprint</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{uploadResult.success}</p>
                    <p className="text-sm text-gray-500">Berhasil</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{uploadResult.notFound}</p>
                    <p className="text-sm text-gray-500">Tidak Ditemukan</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{uploadResult.duplicate}</p>
                    <p className="text-sm text-gray-500">Duplikat</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <FileSpreadsheet className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-600">{uploadResult.failed}</p>
                    <p className="text-sm text-gray-500">Gagal</p>
                  </div>
                </div>

                {/* Not Matched Details */}
                {uploadResult.details.notMatched.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Data Tidak Ditemukan ({uploadResult.details.notMatched.length})
                    </h4>
                    <div className="space-y-2">
                      {uploadResult.details.notMatched.map((item, idx: number) => (
                        <div key={idx} className="text-sm bg-red-50 p-3 rounded border border-red-200">
                          <p><strong>ID:</strong> {item.id} | <strong>Nama:</strong> {item.nama}</p>
                          <p className="text-xs text-gray-500 mt-1">Fingerprint ID tidak cocok dengan karyawan aktif</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={() => router.push('/absensi')} className="flex-1">
                    Lihat Daftar Absensi
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setUploadResult(null);
                      router.push('/absensi/manual');
                    }}
                  >
                    Input Manual
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Missing Employees - Full Width Below */}
        {uploadResult && uploadResult.missingEmployees.length > 0 && (
          <Card className="h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Input Manual - Karyawan Belum Absen
              </CardTitle>
              <CardDescription>
                {uploadResult.missingEmployees.length} karyawan perlu input manual
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-3">
                {uploadResult.missingEmployees.map((karyawan) => (
                  <div key={karyawan.id} className="border rounded-lg p-4 space-y-3">
                    {/* Karyawan Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{karyawan.nama}</p>
                        <p className="text-sm text-gray-600">
                          NIK: {karyawan.nik} {karyawan.jabatan ? `| ${karyawan.jabatan}` : ''}
                        </p>
                      </div>
                      <Badge variant={karyawan.fingerprintId ? 'default' : 'secondary'} className="text-xs">
                        {karyawan.fingerprintId ? `FP: ${karyawan.fingerprintId}` : 'No FP'}
                      </Badge>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-2">
                      {/* Status Kehadiran */}
                      <div className="space-y-1">
                        <Label htmlFor={`status-${karyawan.id}`} className="text-xs">Status Kehadiran</Label>
                        <Select
                          value={formData[karyawan.id]?.statusKehadiran || ''}
                          onValueChange={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              [karyawan.id]: {
                                ...prev[karyawan.id],
                                statusKehadiran: value,
                                keterangan: prev[karyawan.id]?.keterangan || '',
                              }
                            }));
                          }}
                        >
                          <SelectTrigger id={`status-${karyawan.id}`} className="h-9">
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SAKIT">Sakit</SelectItem>
                            <SelectItem value="IZIN">Izin</SelectItem>
                            <SelectItem value="WFH">WFH</SelectItem>
                            <SelectItem value="TANPA_KETERANGAN">Tanpa Keterangan</SelectItem>
                            <SelectItem value="CUTI">Cuti</SelectItem>
                            <SelectItem value="CUTI_BAKU">Cuti Baku</SelectItem>
                            <SelectItem value="SATPAM">Satpam</SelectItem>
                            <SelectItem value="TUGAS">Tugas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Keterangan */}
                      <div className="space-y-1">
                        <Label htmlFor={`keterangan-${karyawan.id}`} className="text-xs">Keterangan (Opsional)</Label>
                        <Input
                          id={`keterangan-${karyawan.id}`}
                          placeholder="Tambahkan keterangan..."
                          value={formData[karyawan.id]?.keterangan || ''}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              [karyawan.id]: {
                                statusKehadiran: prev[karyawan.id]?.statusKehadiran || '',
                                keterangan: e.target.value,
                              }
                            }));
                          }}
                          className="h-9"
                          maxLength={200}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
                <Button
                  onClick={handleBulkSubmit}
                  disabled={
                    bulkCreateMutation.isPending || 
                    Object.values(formData).filter(d => d.statusKehadiran).length === 0
                  }
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {bulkCreateMutation.isPending 
                    ? 'Menyimpan...' 
                    : `Submit ${Object.values(formData).filter(d => d.statusKehadiran).length} Data`
                  }
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFormData({})}
                  disabled={bulkCreateMutation.isPending || Object.keys(formData).length === 0}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Karyawan Belum Absen */}
        {belumAbsenData && belumAbsenData.karyawan.length > 0 && !uploadResult && (
          <Card>
            <CardHeader>
              <CardTitle>Karyawan Belum Absen</CardTitle>
              <CardDescription>
                {belumAbsenData.total} karyawan aktif belum memiliki absensi untuk tanggal ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {belumAbsenData.karyawan.slice(0, 10).map((karyawan) => (
                  <div key={karyawan.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{karyawan.nama}</p>
                      <p className="text-sm text-gray-500">
                        NIK: {karyawan.nik} | {karyawan.jabatan || '-'}
                      </p>
                    </div>
                    <Badge variant={karyawan.fingerprintId ? 'default' : 'secondary'}>
                      {karyawan.fingerprintId ? `FP: ${karyawan.fingerprintId}` : 'No FP ID'}
                    </Badge>
                  </div>
                ))}
              </div>
              {belumAbsenData.total > 10 && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Dan {belumAbsenData.total - 10} karyawan lainnya...
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
