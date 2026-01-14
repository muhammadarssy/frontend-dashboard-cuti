import { TipeCutiTahunan } from '@/lib/constants';

export interface CutiTahunan {
  id: string; // UUID
  karyawanId: string;
  tahun: number;
  jatahDasar: number;
  carryForward: number;
  totalHakCuti: number;
  cutiTerpakai: number;
  sisaCuti: number;
  tipe: TipeCutiTahunan;
  createdAt: string;
  // Relations
  karyawan?: {
    id: string;
    nik: string;
    nama: string;
    jabatan: string | null;
    departemen: string | null;
    tanggalMasuk: string;
    status: string;
  };
  cuti?: Array<{
    id: string;
    jenis: string;
    alasan: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    jumlahHari: number;
    createdAt: string;
  }>;
}

export interface GenerateCutiTahunanInput {
  karyawanId?: string;
  tahun?: number;
}

export interface GenerateBulkInput {
  tahun: number;
}

export interface GenerateBulkResult {
  success: number;
  failed: number;
  results: Array<{
    karyawanId: string;
    nama: string;
    success: boolean;
    data?: CutiTahunan;
    message?: string;
  }>;
}

export interface CutiTahunanFilter {
  tahun?: number;
  karyawanId?: string;
  page?: number;
  limit?: number;
}
