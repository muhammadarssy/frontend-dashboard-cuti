import { JenisCuti } from '@/lib/constants';

export interface Cuti {
  id: string; // UUID
  karyawanId: string;
  cutiTahunanId: string;
  tahun: number;
  jenis: JenisCuti;
  alasan: string | null;
  tanggalMulai: string; // ISO date string
  tanggalSelesai: string; // ISO date string
  jumlahHari: number;
  createdAt: string;
  // Relations
  karyawan?: {
    id: string;
    nik: string;
    nama: string;
    jabatan: string | null;
    departemen: string | null;
  };
  cutiTahunan?: {
    id: string;
    tahun: number;
    jatahDasar: number;
    sisaCuti: number;
  };
}

export interface CreateCutiInput {
  karyawanId: string;
  jenis: JenisCuti;
  alasan?: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

export interface UpdateCutiInput {
  jenis?: JenisCuti;
  alasan?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
}

export interface CutiFilter {
  karyawanId?: string;
  jenis?: JenisCuti;
  tahun?: number;
  page?: number;
  limit?: number;
}

export interface RekapAlasan {
  alasan: string;
  count: number;
  totalHari: number;
}

export interface CutiSummary {
  karyawan: {
    id: string;
    nik: string;
    nama: string;
    jabatan: string | null;
  };
  tahun: number;
  cutiTahunan: {
    jatahDasar: number;
    totalHakCuti: number;
    cutiTerpakai: number;
    sisaCuti: number;
  };
  byJenis: {
    TAHUNAN: number;
    SAKIT: number;
    IZIN: number;
    LAINNYA: number;
  };
  totalCuti: number;
  totalHari: number;
}
