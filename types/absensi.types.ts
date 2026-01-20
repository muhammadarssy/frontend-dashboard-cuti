import { StatusKehadiran } from '@/lib/constants';

export interface Absensi {
  id: string; // UUID
  karyawanId: string;
  tanggal: string; // ISO date string
  jam: string | null; // ISO datetime string untuk jam masuk
  statusKehadiran: StatusKehadiran;
  isManual: boolean;
  keterangan: string | null;
  diinputOleh: string | null;
  karyawan: {
    id: string;
    nik: string;
    nama: string;
    jabatan: string | null;
    departemen: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAbsensiManualInput {
  karyawanId: string;
  tanggal: string;
  statusKehadiran: StatusKehadiran;
  keterangan?: string;
  diinputOleh?: string;
}

export interface UpdateAbsensiInput {
  statusKehadiran?: StatusKehadiran;
  keterangan?: string;
  diinputOleh?: string;
}

export interface UploadFingerprintInput {
  file: File;
  tanggal: string;
}

export interface UploadFingerprintResult {
  success: number;
  failed: number;
  notFound: number;
  duplicate: number;
  details: {
    processed: string[];
    notMatched: Array<{
      id: number;
      nik: string;
      nama: string;
      waktu: string;
      status: string;
    }>;
    duplicates: string[];
  };
  missingEmployees: Array<{
    id: string;
    nama: string;
    nik: string;
    jabatan: string | null;
    fingerprintId: number | null;
  }>;
}

export interface KaryawanBelumAbsen {
  id: string;
  nik: string;
  nama: string;
  jabatan: string | null;
  departemen: string | null;
  fingerprintId: number | null;
}

export interface AbsensiFilter {
  tanggalMulai?: string;
  tanggalSelesai?: string;
  karyawanId?: string;
  statusKehadiran?: StatusKehadiran;
  isManual?: boolean;
  page?: number;
  limit?: number;
}

export interface RingkasanAbsensi {
  HADIR?: number;
  SAKIT?: number;
  IZIN?: number;
  WFH?: number;
  TANPA_KETERANGAN?: number;
  CUTI?: number;
  CUTI_BAKU?: number;
  SECURITY?: number;
  TUGAS?: number;
  BELUM_FINGERPRINT?: number;
}
