import { StatusKaryawan } from '@/lib/constants';

export interface Karyawan {
  id: string; // UUID
  nik: string;
  fingerprintId: number | null;
  nama: string;
  jabatan: string | null;
  departemen: string | null;
  tanggalMasuk: string; // ISO date string
  status: StatusKaryawan;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKaryawanInput {
  nik: string;
  fingerprintId?: number;
  nama: string;
  jabatan?: string;
  departemen?: string;
  tanggalMasuk: string;
}

export interface UpdateKaryawanInput {
  fingerprintId?: number | null;
  nama?: string;
  jabatan?: string;
  departemen?: string;
  tanggalMasuk?: string;
  status?: StatusKaryawan;
}

export interface KaryawanFilter {
  status?: StatusKaryawan;
  search?: string;
  page?: number;
  limit?: number;
}
