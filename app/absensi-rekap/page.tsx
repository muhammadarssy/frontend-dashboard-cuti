'use client';

import { useState, useRef } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Upload,
  FileSpreadsheet,
  Download,
  Printer,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pencil,
  X,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { useUploadRekap, useExportRekapExcel, useExportRekapPdf } from '@/hooks/useAbsensiRekap';
import type { RekapAbsensiItem } from '@/types/absensi-rekap.types';

export default function AbsensiRekapPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [periodeLabel, setPeriodeLabel] = useState('');

  // Data hasil parse dari backend
  const [rekapData, setRekapData] = useState<RekapAbsensiItem[]>([]);
  const [notMatched, setNotMatched] = useState<
    Array<{ empNo: string; nama: string; nik: string }>
  >([]);
  const [summary, setSummary] = useState<{
    totalRows: number;
    matchedRows: number;
    notMatchedRows: number;
  } | null>(null);

  // State inline edit per baris
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editBuffer, setEditBuffer] = useState<Partial<RekapAbsensiItem>>({});

  const formatTanggal = (iso: string) => {
    if (!iso) return '-';
    const parts = iso.split('-');
    if (parts.length !== 3) return iso;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const uploadMutation = useUploadRekap();
  const exportExcelMutation = useExportRekapExcel();
  const exportPdfMutation = useExportRekapPdf();

  const hasData = rekapData.length > 0;

  // ─── Upload ───────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Pilih file Excel terlebih dahulu');
      return;
    }

    const result = await uploadMutation.mutateAsync(selectedFile);
    setRekapData([...result.data].sort((a, b) => a.nama.localeCompare(b.nama, 'id')));
    setNotMatched(result.notMatched);
    setSummary({
      totalRows: result.totalRows,
      matchedRows: result.matchedRows,
      notMatchedRows: result.notMatchedRows,
    });
    toast.success(
      `File diproses: ${result.matchedRows} cocok, ${result.notMatchedRows} tidak ditemukan`
    );
  };

  // ─── Inline Edit ─────────────────────────────────────────────────────────
  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditBuffer({ ...rekapData[idx] });
  };

  const cancelEdit = () => {
    setEditingIdx(null);
    setEditBuffer({});
  };

  const saveEdit = () => {
    if (editingIdx === null) return;
    setRekapData((prev) =>
      prev.map((row, i) =>
        i === editingIdx ? { ...row, ...editBuffer } : row
      )
    );
    setEditingIdx(null);
    setEditBuffer({});
  };

  // ─── Export ───────────────────────────────────────────────────────────────
  const matchedData = rekapData.filter((row) => row.karyawanId !== null);

  const handleExportExcel = async () => {
    if (!hasData) return;
    await exportExcelMutation.mutateAsync({ data: matchedData, periodeLabel: periodeLabel || undefined });
  };

  const handleExportPdf = async () => {
    if (!hasData) return;
    const payload = await exportPdfMutation.mutateAsync({
      data: matchedData,
      periodeLabel: periodeLabel || undefined,
    });

    if (!payload) return;

    // Buka window print dengan tabel HTML sederhana
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Popup diblokir browser. Izinkan popup untuk halaman ini.');
      return;
    }

    const rows = payload.rows
      .map(
        (r) => `
      <tr>
        <td>${r.no}</td>
        <td>${r.nama}</td>
        <td>${r.tanggal.split('-').reverse().join('-')}</td>
        <td>${r.scanMasuk}</td>
        <td>${r.scanPulang}</td>
        <td>${r.keterangan}</td>
      </tr>`
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Rekap Absensi${payload.periodeLabel ? ' - ' + payload.periodeLabel : ''}</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; }
          h2 { text-align: center; margin-bottom: 4px; }
          p.sub { text-align: center; color: #666; margin-bottom: 16px; font-size: 10px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #2F75B6; color: #fff; padding: 6px 8px; text-align: left; font-size: 11px; }
          td { padding: 5px 8px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) td { background: #f5f5f5; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h2>Rekap Absensi${payload.periodeLabel ? ' - ' + payload.periodeLabel : ''}</h2>
        <p class="sub">Total: ${payload.summary.totalRecords} record | ${payload.summary.totalKaryawan} karyawan | ${payload.summary.totalTanggal} tanggal</p>
        <table>
          <thead>
            <tr>
              <th>No.</th><th>Nama</th><th>Tanggal</th>
              <th>Masuk</th><th>Pulang</th><th>Keterangan</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 400);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="space-y-6 max-w-screen-2xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rekap Absensi</h1>
          <p className="text-gray-500 mt-1">
            Upload file rekap dari mesin absensi, edit data, lalu export ke Excel atau PDF
          </p>
        </div>

        {/* Info Alert */}
        <Alert>
          <FileSpreadsheet className="h-4 w-4" />
          <AlertDescription>
            <strong>Format kolom Excel:</strong> Emp No. | No. ID | NIK | Nama | Auto-Assign |
            Tanggal | Jam Kerja | Jam Masuk | Jam Pulang | Scan Masuk | Scan Pulang
          </AlertDescription>
        </Alert>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload File Rekap</CardTitle>
            <CardDescription>Pilih file Excel hasil ekspor dari mesin absensi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              {/* File picker */}
              <div className="flex-1 space-y-2">
                <Label>File Excel (.xls / .xlsx)</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {/* Label periode opsional */}
              <div className="w-56 space-y-2">
                <Label>Label Periode (opsional)</Label>
                <Input
                  placeholder="misal: Februari 2026"
                  value={periodeLabel}
                  onChange={(e) => setPeriodeLabel(e.target.value)}
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                className="shrink-0"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadMutation.isPending ? 'Memproses...' : 'Proses File'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary setelah upload */}
        {summary && (
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center bg-white">
              <FileSpreadsheet className="h-7 w-7 text-gray-400 mx-auto mb-1" />
              <p className="text-2xl font-bold">{summary.totalRows}</p>
              <p className="text-xs text-gray-500">Total Baris</p>
            </div>
            <div className="border rounded-lg p-4 text-center bg-white">
              <CheckCircle className="h-7 w-7 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-600">{summary.matchedRows}</p>
              <p className="text-xs text-gray-500">Cocok dengan Karyawan</p>
            </div>
            <div className="border rounded-lg p-4 text-center bg-white">
              <XCircle className="h-7 w-7 text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-yellow-600">{summary.notMatchedRows}</p>
              <p className="text-xs text-gray-500">Tidak Ditemukan</p>
            </div>
          </div>
        )}

        {/* Not Matched Warning */}
        {notMatched.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{notMatched.length} Emp No. tidak cocok</strong> dengan karyawan aktif:{' '}
              {notMatched.map((nm) => `${nm.empNo} (${nm.nama})`).join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Data Table */}
        {hasData && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Data Rekap</CardTitle>
                <CardDescription>
                  {rekapData.length} baris — klik ikon pensil untuk mengedit
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportExcel}
                  disabled={exportExcelMutation.isPending}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exportExcelMutation.isPending ? 'Export...' : 'Export Excel'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportPdf}
                  disabled={exportPdfMutation.isPending}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {exportPdfMutation.isPending ? 'Menyiapkan...' : 'Print / PDF'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-10">No.</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Masuk</TableHead>
                      <TableHead>Pulang</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="w-20">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matchedData.map((row, idx) => {
                      const isEditing = editingIdx === idx;

                      return (
                        <TableRow
                          key={idx}
                        >
                          <TableCell className="text-gray-400 text-xs">{idx + 1}</TableCell>

                          {/* Nama */}
                          <TableCell className="font-medium">{row.nama}</TableCell>

                          {/* Tanggal */}
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="date"
                                className="h-8 text-sm w-36"
                                value={editBuffer.tanggal ?? row.tanggal}
                                onChange={(e) =>
                                  setEditBuffer((prev) => ({ ...prev, tanggal: e.target.value }))
                                }
                              />
                            ) : (
                              formatTanggal(row.tanggal)
                            )}
                          </TableCell>

                          {/* Masuk */}
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="time"
                                className="h-8 text-sm w-28"
                                value={editBuffer.scanMasuk ?? row.scanMasuk ?? ''}
                                onChange={(e) =>
                                  setEditBuffer((prev) => ({
                                    ...prev,
                                    scanMasuk: e.target.value || null,
                                  }))
                                }
                              />
                            ) : (
                              row.scanMasuk ?? <span className="text-gray-400">-</span>
                            )}
                          </TableCell>

                          {/* Pulang */}
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="time"
                                className="h-8 text-sm w-28"
                                value={editBuffer.scanPulang ?? row.scanPulang ?? ''}
                                onChange={(e) =>
                                  setEditBuffer((prev) => ({
                                    ...prev,
                                    scanPulang: e.target.value || null,
                                  }))
                                }
                              />
                            ) : (
                              row.scanPulang ?? <span className="text-gray-400">-</span>
                            )}
                          </TableCell>

                          {/* Keterangan */}
                          <TableCell>
                            {isEditing ? (
                              <Input
                                className="h-8 text-sm"
                                placeholder="Keterangan..."
                                value={editBuffer.keterangan ?? row.keterangan ?? ''}
                                onChange={(e) =>
                                  setEditBuffer((prev) => ({
                                    ...prev,
                                    keterangan: e.target.value || null,
                                  }))
                                }
                              />
                            ) : (
                              row.keterangan ?? <span className="text-gray-400">-</span>
                            )}
                          </TableCell>

                          {/* Aksi */}
                          <TableCell>
                            {isEditing ? (
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-green-600"
                                  onClick={saveEdit}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-gray-400"
                                  onClick={cancelEdit}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => startEdit(idx)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
