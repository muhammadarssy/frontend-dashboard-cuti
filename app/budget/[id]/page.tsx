'use client';

import { use } from 'react';
import { useBudget, useBudgetSummary } from '@/hooks/useBudget';
import { useStruks } from '@/hooks/useStruk';
import { BudgetForm } from '@/components/budget/BudgetForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Eye } from 'lucide-react';
import { formatDate } from '@/lib/helpers';
import Link from 'next/link';

const bulanNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export default function BudgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: budget, isLoading: isLoadingBudget } = useBudget(id);
  const { data: summary, isLoading: isLoadingSummary } = useBudgetSummary(id);
  const { data: struksData, isLoading: isLoadingStruks } = useStruks(id, undefined, undefined, 1, 100);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (isLoadingBudget) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Budget tidak ditemukan</p>
        <Button variant="outline" onClick={() => router.push('/budget')} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            Budget {bulanNames[budget.bulan - 1]} {budget.tahun}
          </h1>
          <p className="text-muted-foreground">Detail dan edit budget</p>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(summary.totalBudget)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatRupiah(summary.totalPengeluaran)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Sisa Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatRupiah(summary.sisaBudget)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Persentase Terpakai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.totalBudget > 0
                  ? Math.round((summary.totalPengeluaran / summary.totalBudget) * 100)
                  : 0}
                %
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      summary.totalBudget > 0
                        ? Math.min((summary.totalPengeluaran / summary.totalBudget) * 100, 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* List Struk */}
      {!isLoadingStruks && struksData && struksData.data && struksData.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Struk</CardTitle>
            <CardDescription>
              Struk yang menggunakan budget {bulanNames[budget.bulan - 1]} {budget.tahun}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nomor Struk</TableHead>
                    <TableHead className="text-right">Total Setelah Tax</TableHead>
                    <TableHead className="text-right">Jumlah Item</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {struksData.data
                    .filter((struk) => struk && struk.id)
                    .map((struk) => (
                      <TableRow key={struk.id}>
                        <TableCell>
                          {struk.tanggal ? formatDate(struk.tanggal) : '-'}
                        </TableCell>
                        <TableCell>{struk.nomorStruk || '-'}</TableCell>
                        <TableCell className="text-right font-medium">
                          {struk.totalSetelahTax !== undefined && struk.totalSetelahTax !== null
                            ? formatRupiah(struk.totalSetelahTax)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {struk._count?.strukItem || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/struk/${struk.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoadingStruks && struksData && (!struksData.data || struksData.data.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Struk</CardTitle>
            <CardDescription>
              Struk yang menggunakan budget {bulanNames[budget.bulan - 1]} {budget.tahun}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Belum ada struk untuk budget ini
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-white p-6 rounded-lg border">
        <BudgetForm budget={budget} />
      </div>
    </div>
  );
}
