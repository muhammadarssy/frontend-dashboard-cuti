'use client';

import { useState } from 'react';
import { useItems } from '@/hooks/useItem';
import { ItemTable } from '@/components/item/ItemTable';
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

export default function ItemPage() {
  const [page, setPage] = useState(1);
  const [kategori, setKategori] = useState<string>('');
  const [searchKode, setSearchKode] = useState('');
  const [searchNama, setSearchNama] = useState('');
  const [stokMenipis, setStokMenipis] = useState<boolean | undefined>(undefined);

  const { data, isLoading } = useItems(
    kategori || undefined,
    searchKode || undefined,
    searchNama || undefined,
    stokMenipis,
    page,
    10
  );

  const handleSearch = () => {
    setPage(1);
  };

  const handleReset = () => {
    setKategori('');
    setSearchKode('');
    setSearchNama('');
    setStokMenipis(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Master Item</h1>
          <p className="text-muted-foreground">Kelola data barang ATK dan Obat</p>
        </div>
        <Link href="/item/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Item
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
            <label className="text-sm font-medium mb-2 block">Kode</label>
            <Input
              placeholder="Cari kode..."
              value={searchKode}
              onChange={(e) => setSearchKode(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Nama Item</label>
            <Input
              placeholder="Cari nama..."
              value={searchNama}
              onChange={(e) => setSearchNama(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Status Stok</label>
            <Select
              value={stokMenipis === undefined ? 'all' : stokMenipis ? 'menipis' : 'normal'}
              onValueChange={(val) =>
                setStokMenipis(val === 'all' ? undefined : val === 'menipis')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="menipis">Stok Menipis</SelectItem>
                <SelectItem value="normal">Stok Normal</SelectItem>
              </SelectContent>
            </Select>
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
        <ItemTable data={data?.data || []} isLoading={isLoading} />

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Halaman {data.pagination.page} dari {data.pagination.totalPages} (Total:{' '}
              {data.pagination.total} item)
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
