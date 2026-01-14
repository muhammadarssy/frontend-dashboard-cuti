'use client';

import { useState } from 'react';
import { usePembelians } from '@/hooks/usePembelian';
import { PembelianTable } from '@/components/pembelian/PembelianTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function PembelianPage() {
  const [page, setPage] = useState(1);
  const [kategori, setKategori] = useState<string>('');
  const [supplier, setSupplier] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');

  const { data, isLoading } = usePembelians(
    undefined,
    kategori || undefined,
    supplier || undefined,
    tanggalMulai || undefined,
    tanggalSelesai || undefined,
    page,
    10
  );

  const handleSearch = () => {
    setPage(1);
  };

  const handleReset = () => {
    setKategori('');
    setSupplier('');
    setTanggalMulai('');
    setTanggalSelesai('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pembelian</h1>
          <p className="text-muted-foreground">Kelola transaksi pembelian barang (stok masuk)</p>
        </div>
        <Link href="/pembelian/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pembelian
          </Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="font-semibold">Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Kategori</label>
            <Select value={kategori} onValueChange={setKategori}>
              <SelectTrigger>
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua kategori</SelectItem>
                <SelectItem value="ATK">ATK</SelectItem>
                <SelectItem value="OBAT">OBAT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Supplier</label>
            <Input
              placeholder="Cari supplier..."
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tanggal Mulai</label>
            <Input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tanggal Selesai</label>
            <Input type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Cari
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <PembelianTable data={data?.data || []} isLoading={isLoading} />

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Halaman {data.pagination.page} dari {data.pagination.totalPages} (Total:{' '}
              {data.pagination.total} transaksi)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.pagination.totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
