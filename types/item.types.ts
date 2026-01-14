export type KategoriItem = 'ATK' | 'OBAT';

export interface Item {
  id: string;
  kode: string;
  nama: string;
  kategori: KategoriItem;
  satuan: string;
  stokMinimal: number;
  stokSekarang: number;
  keterangan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemFormData {
  kode: string;
  nama: string;
  kategori: KategoriItem;
  satuan: string;
  stokMinimal?: number;
  stokSekarang?: number;
  keterangan?: string;
}

export interface ItemStokMenipis extends Item {
  selisih: number;
}
