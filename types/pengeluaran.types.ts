import { Item } from './item.types';

export interface Pengeluaran {
  id: string;
  itemId: string;
  item: Item;
  jumlah: number;
  tanggal: string;
  keperluan: string;
  penerima?: string;
  keterangan?: string;
  createdAt: string;
}

export interface PengeluaranFormData {
  itemId: string;
  jumlah: number;
  tanggal: string;
  keperluan: string;
  penerima?: string;
  keterangan?: string;
}

export interface RekapPengeluaran {
  periode: {
    mulai: string;
    selesai: string;
  };
  rekap: Array<{
    itemId?: string;
    kode?: string;
    nama?: string;
    kategori?: string;
    keperluan?: string;
    penerima?: string;
    totalJumlah: number;
    totalTransaksi: number;
  }>;
}
