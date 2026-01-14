import { Item } from './item.types';

export interface Pembelian {
  id: string;
  itemId: string;
  item: Item;
  jumlah: number;
  tanggal: string;
  supplier?: string;
  hargaSatuan?: number;
  totalHarga?: number;
  keterangan?: string;
  createdAt: string;
}

export interface PembelianFormData {
  itemId: string;
  jumlah: number;
  tanggal: string;
  supplier?: string;
  hargaSatuan?: number;
  keterangan?: string;
}

export interface RekapPembelian {
  periode: {
    mulai: string;
    selesai: string;
  };
  totalNilai: number;
  rekap: Array<{
    itemId?: string;
    kode?: string;
    nama?: string;
    kategori?: string;
    supplier?: string;
    totalJumlah: number;
    totalNilai: number;
    totalTransaksi: number;
  }>;
}
