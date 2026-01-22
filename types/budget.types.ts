export interface KategoriBudget {
  id: string;
  nama: string;
  deskripsi?: string;
  isAktif: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    budgetKategori: number;
    strukItem: number;
  };
}

export interface KategoriBudgetFormData {
  nama: string;
  deskripsi?: string;
  isAktif?: boolean;
}

export interface BudgetKategori {
  id: string;
  budgetId: string;
  kategoriBudgetId: string;
  alokasi: number;
  kategoriBudget?: KategoriBudget;
}

export interface BudgetRincian {
  kategoriBudgetId: string;
  alokasi: number;
}

export interface Budget {
  id: string;
  bulan: number;
  tahun: number;
  totalBudget: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    struk: number;
  };
  struk?: Struk[];
  budgetKategori?: BudgetKategori[];
}

export interface BudgetFormData {
  bulan: number;
  tahun: number;
  rincian: BudgetRincian[];
}

export interface RincianPerKategori {
  kategoriBudget: KategoriBudget;
  alokasi: number;
  terpakai: number;
  sisa: number;
}

export interface BudgetSummary {
  id: string;
  bulan: number;
  tahun: number;
  totalBudget: number;
  totalPengeluaran: number;
  sisaBudget: number;
  persentaseTerpakai: number;
  rincianPerKategori?: RincianPerKategori[];
  createdAt: string;
  updatedAt: string;
}

export interface Struk {
  id: string;
  budgetId: string;
  tanggal: string;
  nomorStruk?: string;
  fileBukti?: string;
  namaFileAsli?: string;
  totalHarga: number;
  totalDiscount: number;
  taxPersen?: number;
  taxNominal: number;
  totalSetelahTax: number;
  keterangan?: string;
  budget?: Budget;
  strukItem?: StrukItem[];
  _count?: {
    strukItem: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StrukItem {
  id: string;
  strukId: string;
  labelStrukId: string;
  kategoriBudgetId: string;
  namaItem: string;
  itemId?: string;
  harga: number;
  qty: number;
  subtotal: number;
  discountType?: 'BONUS' | 'PERSEN';
  discountValue?: number;
  discountNominal: number;
  totalSetelahDiscount: number;
  keterangan?: string;
  labelStruk?: LabelStruk;
  kategoriBudget?: KategoriBudget;
  item?: {
    id: string;
    kode: string;
    nama: string;
  };
  createdAt: string;
}

export interface LabelStruk {
  id: string;
  nama: string;
  deskripsi?: string;
  warna?: string;
  isAktif: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    strukItem: number;
  };
}

export interface LabelStrukFormData {
  nama: string;
  deskripsi?: string;
  warna?: string;
  isAktif?: boolean;
}

export interface StrukFormData {
  budgetId: string;
  tanggal: string;
  nomorStruk?: string;
  fileBukti?: string;
  namaFileAsli?: string;
  items: StrukItemFormData[];
  taxPersen?: number;
  taxNominal?: number;
  keterangan?: string;
}

export interface StrukItemFormData {
  labelStrukId: string;
  kategoriBudgetId: string;
  namaItem: string;
  itemId?: string;
  harga: number;
  qty: number;
  discountType?: 'BONUS' | 'PERSEN';
  discountValue?: number;
  keterangan?: string;
}

export interface RekapLabel {
  label: LabelStruk;
  totalPengeluaran: number;
  totalQty: number;
  jumlahItem: number;
}

export interface RekapKategori {
  kategoriBudget: KategoriBudget;
  totalPengeluaran: number;
  totalQty: number;
  jumlahItem: number;
}
