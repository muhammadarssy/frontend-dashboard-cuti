/**
 * Constants for the application
 */

// Status Karyawan
export const STATUS_KARYAWAN = {
  AKTIF: 'AKTIF',
  NONAKTIF: 'NONAKTIF',
} as const;

export type StatusKaryawan = (typeof STATUS_KARYAWAN)[keyof typeof STATUS_KARYAWAN];

// Jenis Cuti
export const JENIS_CUTI = {
  TAHUNAN: 'TAHUNAN',
  SAKIT: 'SAKIT',
  IZIN: 'IZIN',
  BAKU: 'BAKU',
  TANPA_KETERANGAN: 'TANPA_KETERANGAN',
  LAINNYA: 'LAINNYA',
} as const;

export type JenisCuti = (typeof JENIS_CUTI)[keyof typeof JENIS_CUTI];

// Remove STATUS_CUTI as backend doesn't use it

// Tipe Cuti Tahunan
export const TIPE_CUTI_TAHUNAN = {
  PROBATION: 'PROBATION',
  PRORATE: 'PRORATE',
  FULL: 'FULL',
} as const;

export type TipeCutiTahunan = (typeof TIPE_CUTI_TAHUNAN)[keyof typeof TIPE_CUTI_TAHUNAN];

// Labels for display
export const JENIS_CUTI_LABELS: Record<JenisCuti, string> = {
  TAHUNAN: 'Cuti Tahunan',
  SAKIT: 'Cuti Sakit',
  IZIN: 'Izin',
  BAKU: 'Cuti Baku',
  TANPA_KETERANGAN: 'Tanpa Keterangan',
  LAINNYA: 'Lainnya',
};

export const TIPE_CUTI_TAHUNAN_LABELS: Record<TipeCutiTahunan, string> = {
  PROBATION: 'Probation (0 hari)',
  PRORATE: 'Prorate (7 hari)',
  FULL: 'Full (12 hari)',
};

export const STATUS_KARYAWAN_COLORS: Record<StatusKaryawan, string> = {
  AKTIF: 'bg-green-100 text-green-800',
  NONAKTIF: 'bg-gray-100 text-gray-800',
};

// Status Kehadiran (Absensi)
export const STATUS_KEHADIRAN = {
  HADIR: 'HADIR',
  SAKIT: 'SAKIT',
  IZIN: 'IZIN',
  WFH: 'WFH',
  TANPA_KETERANGAN: 'TANPA_KETERANGAN',
  CUTI: 'CUTI',
  CUTI_BAKU: 'CUTI_BAKU',
  SATPAM: 'SATPAM',
  TUGAS: 'TUGAS',
} as const;

export type StatusKehadiran = (typeof STATUS_KEHADIRAN)[keyof typeof STATUS_KEHADIRAN];

export const STATUS_KEHADIRAN_LABELS: Record<StatusKehadiran, string> = {
  HADIR: 'Hadir',
  SAKIT: 'Sakit',
  IZIN: 'Izin',
  WFH: 'Work From Home',
  TANPA_KETERANGAN: 'Tanpa Keterangan',
  CUTI: 'Cuti',
  CUTI_BAKU: 'Cuti Baku',
  SATPAM: 'Satpam',
  TUGAS: 'Tugas',
};

export const STATUS_KEHADIRAN_COLORS: Record<StatusKehadiran, string> = {
  HADIR: 'bg-green-100 text-green-800',
  SAKIT: 'bg-red-100 text-red-800',
  IZIN: 'bg-blue-100 text-blue-800',
  WFH: 'bg-purple-100 text-purple-800',
  TANPA_KETERANGAN: 'bg-gray-100 text-gray-800',
  CUTI: 'bg-orange-100 text-orange-800',
  CUTI_BAKU: 'bg-teal-100 text-teal-800',
  SATPAM: 'bg-indigo-100 text-indigo-800',
  TUGAS: 'bg-yellow-100 text-yellow-800',
};

// Pagination
export const ITEMS_PER_PAGE = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

// Kategori Item Inventory
export const KATEGORI_ITEM = {
  ATK: 'ATK',
  OBAT: 'OBAT',
} as const;

export type KategoriItem = (typeof KATEGORI_ITEM)[keyof typeof KATEGORI_ITEM];

export const KATEGORI_ITEM_LABELS: Record<KategoriItem, string> = {
  ATK: 'ATK (Alat Tulis Kantor)',
  OBAT: 'Obat-obatan',
};

export const KATEGORI_ITEM_COLORS: Record<KategoriItem, string> = {
  ATK: 'bg-blue-100 text-blue-800',
  OBAT: 'bg-green-100 text-green-800',
};

// API Messages
export const API_MESSAGES = {
  CREATE_SUCCESS: 'Data berhasil ditambahkan',
  UPDATE_SUCCESS: 'Data berhasil diperbarui',
  DELETE_SUCCESS: 'Data berhasil dihapus',
  LOAD_ERROR: 'Gagal memuat data',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan',
};
