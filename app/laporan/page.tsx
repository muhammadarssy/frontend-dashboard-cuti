'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRekapPembelian } from '@/hooks/usePembelian';
import { useRekapPengeluaran } from '@/hooks/usePengeluaran';
import { useState } from 'react';
import { format } from 'date-fns';
import { KATEGORI_ITEM, KATEGORI_ITEM_LABELS } from '@/lib/constants';
import { formatCurrency } from '@/lib/helpers';

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState('pembelian');
  
  // Filter states - Pembelian
  const [kategoriPembelian, setKategoriPembelian] = useState<string>('ALL');
  const [tanggalMulaiPembelian, setTanggalMulaiPembelian] = useState(
    format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd')
  );
  const [tanggalSelesaiPembelian, setTanggalSelesaiPembelian] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [groupByPembelian, setGroupByPembelian] = useState<'item' | 'supplier'>('item');

  // Filter states - Pengeluaran
  const [kategoriPengeluaran, setKategoriPengeluaran] = useState<string>('ALL');
  const [tanggalMulaiPengeluaran, setTanggalMulaiPengeluaran] = useState(
    format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd')
  );
  const [tanggalSelesaiPengeluaran, setTanggalSelesaiPengeluaran] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [groupByPengeluaran, setGroupByPengeluaran] = useState<'item' | 'keperluan' | 'penerima'>('item');

  // Fetch data
  const { data: rekapPembelian, isLoading: loadingPembelian } = useRekapPembelian(
    kategoriPembelian === 'ALL' ? undefined : kategoriPembelian,
    tanggalMulaiPembelian,
    tanggalSelesaiPembelian,
    groupByPembelian
  );

  const { data: rekapPengeluaran, isLoading: loadingPengeluaran } = useRekapPengeluaran(
    kategoriPengeluaran === 'ALL' ? undefined : kategoriPengeluaran,
    tanggalMulaiPengeluaran,
    tanggalSelesaiPengeluaran,
    groupByPengeluaran
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Inventory</h1>
          <p className="text-gray-500 mt-1">Rekap data pembelian dan pengeluaran barang</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pembelian">Rekap Pembelian</TabsTrigger>
            <TabsTrigger value="pengeluaran">Rekap Pengeluaran</TabsTrigger>
          </TabsList>

          {/* PEMBELIAN TAB */}
          <TabsContent value="pembelian" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Filter Rekap Pembelian</CardTitle>
                <CardDescription>Pilih periode dan kategori untuk melihat rekap</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select value={kategoriPembelian} onValueChange={setKategoriPembelian}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Semua Kategori</SelectItem>
                        <SelectItem value={KATEGORI_ITEM.ATK}>{KATEGORI_ITEM_LABELS[KATEGORI_ITEM.ATK]}</SelectItem>
                        <SelectItem value={KATEGORI_ITEM.OBAT}>{KATEGORI_ITEM_LABELS[KATEGORI_ITEM.OBAT]}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Mulai</Label>
                    <Input
                      type="date"
                      value={tanggalMulaiPembelian}
                      onChange={(e) => setTanggalMulaiPembelian(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Selesai</Label>
                    <Input
                      type="date"
                      value={tanggalSelesaiPembelian}
                      onChange={(e) => setTanggalSelesaiPembelian(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kelompokkan Berdasarkan</Label>
                    <Select value={groupByPembelian} onValueChange={(v) => setGroupByPembelian(v as 'item' | 'supplier')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="item">Item</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hasil Rekap Pembelian</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPembelian ? (
                  <p className="text-center text-gray-500">Memuat data...</p>
                ) : rekapPembelian && rekapPembelian.rekap?.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Transaksi</p>
                        <p className="text-2xl font-bold text-blue-600">{rekapPembelian.rekap.reduce((sum, item) => sum + item.totalTransaksi, 0)}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Jumlah</p>
                        <p className="text-2xl font-bold text-green-600">{rekapPembelian.rekap.reduce((sum, item) => sum + item.totalJumlah, 0)}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Nilai</p>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(rekapPembelian.totalNilai)}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">
                              {groupByPembelian === 'item' ? 'Item' : 'Supplier'}
                            </th>
                            <th className="text-right py-2">Total Transaksi</th>
                            <th className="text-right py-2">Total Jumlah</th>
                            <th className="text-right py-2">Total Nilai</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rekapPembelian.rekap.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{groupByPembelian === 'item' ? `${item.kode} - ${item.nama}` : item.supplier}</td>
                              <td className="text-right py-2">{item.totalTransaksi}</td>
                              <td className="text-right py-2">{item.totalJumlah}</td>
                              <td className="text-right py-2">{formatCurrency(item.totalNilai)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Tidak ada data untuk periode ini</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PENGELUARAN TAB */}
          <TabsContent value="pengeluaran" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Filter Rekap Pengeluaran</CardTitle>
                <CardDescription>Pilih periode dan kategori untuk melihat rekap</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select value={kategoriPengeluaran} onValueChange={setKategoriPengeluaran}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Semua Kategori</SelectItem>
                        <SelectItem value={KATEGORI_ITEM.ATK}>{KATEGORI_ITEM_LABELS[KATEGORI_ITEM.ATK]}</SelectItem>
                        <SelectItem value={KATEGORI_ITEM.OBAT}>{KATEGORI_ITEM_LABELS[KATEGORI_ITEM.OBAT]}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Mulai</Label>
                    <Input
                      type="date"
                      value={tanggalMulaiPengeluaran}
                      onChange={(e) => setTanggalMulaiPengeluaran(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Selesai</Label>
                    <Input
                      type="date"
                      value={tanggalSelesaiPengeluaran}
                      onChange={(e) => setTanggalSelesaiPengeluaran(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kelompokkan Berdasarkan</Label>
                    <Select value={groupByPengeluaran} onValueChange={(v) => setGroupByPengeluaran(v as 'item' | 'keperluan' | 'penerima')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="item">Item</SelectItem>
                        <SelectItem value="keperluan">Keperluan</SelectItem>
                        <SelectItem value="penerima">Penerima</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hasil Rekap Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPengeluaran ? (
                  <p className="text-center text-gray-500">Memuat data...</p>
                ) : rekapPengeluaran && rekapPengeluaran.rekap?.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Transaksi</p>
                        <p className="text-2xl font-bold text-blue-600">{rekapPengeluaran.rekap.reduce((sum, item) => sum + item.totalTransaksi, 0)}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Jumlah</p>
                        <p className="text-2xl font-bold text-red-600">{rekapPengeluaran.rekap.reduce((sum, item) => sum + item.totalJumlah, 0)}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">
                              {groupByPengeluaran === 'item' ? 'Item' : groupByPengeluaran === 'keperluan' ? 'Keperluan' : 'Penerima'}
                            </th>
                            <th className="text-right py-2">Total Transaksi</th>
                            <th className="text-right py-2">Total Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rekapPengeluaran.rekap.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">
                                {groupByPengeluaran === 'item' ? `${item.kode} - ${item.nama}` : 
                                 groupByPengeluaran === 'keperluan' ? item.keperluan : 
                                 item.penerima}
                              </td>
                              <td className="text-right py-2">{item.totalTransaksi}</td>
                              <td className="text-right py-2">{item.totalJumlah}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Tidak ada data untuk periode ini</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
