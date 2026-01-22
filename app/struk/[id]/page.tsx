'use client';

import { use } from 'react';
import { useStruk } from '@/hooks/useStruk';
import { StrukForm } from '@/components/struk/StrukForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/helpers';

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

export default function StrukDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: struk, isLoading } = useStruk(id);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!struk) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Struk tidak ditemukan</p>
        <Button variant="outline" onClick={() => router.push('/struk')} className="mt-4">
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
            Struk {struk.nomorStruk || formatDate(struk.tanggal)}
          </h1>
          <p className="text-muted-foreground">Detail dan edit struk pembelian</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Harga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(struk.totalHarga)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{formatRupiah(struk.totalDiscount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Setelah Tax</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatRupiah(struk.totalSetelahTax)}
            </div>
          </CardContent>
        </Card>
      </div>

      {struk.strukItem && struk.strukItem.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>Daftar item dalam struk ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {struk.strukItem.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{item.namaItem}</h4>
                      {item.labelStruk && (
                        <Badge
                          className="mt-1"
                          style={{
                            backgroundColor: item.labelStruk.warna
                              ? `${item.labelStruk.warna}20`
                              : undefined,
                            color: item.labelStruk.warna || undefined,
                          }}
                        >
                          {item.labelStruk.nama}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatRupiah(item.totalSetelahDiscount)}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.harga} × {item.qty}
                      </div>
                    </div>
                  </div>
                  {item.discountNominal > 0 && (
                    <div className="text-sm text-red-600">
                      Discount: {formatRupiah(item.discountNominal)}
                    </div>
                  )}
                  {item.keterangan && (
                    <div className="text-sm text-muted-foreground mt-2">{item.keterangan}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-white p-6 rounded-lg border">
        <StrukForm struk={struk} />
      </div>
    </div>
  );
}
