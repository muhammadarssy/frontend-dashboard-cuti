import { z } from 'zod';
import { STATUS_KEHADIRAN } from '@/lib/constants';

export const uploadFingerprintSchema = z.object({
  file: z
    .instanceof(File, { message: 'File wajib diupload' })
    .refine((file) => file.size > 0, 'File tidak boleh kosong')
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Ukuran file maksimal 5MB')
    .refine(
      (file) =>
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'File harus berformat Excel (.xls atau .xlsx)'
    ),
  tanggal: z
    .string()
    .min(1, 'Tanggal wajib diisi')
    .refine((date) => !isNaN(Date.parse(date)), 'Format tanggal tidak valid'),
});

export const absensiManualSchema = z.object({
  karyawanId: z.string().min(1, 'Karyawan wajib dipilih'),
  tanggal: z
    .string()
    .min(1, 'Tanggal wajib diisi')
    .refine((date) => !isNaN(Date.parse(date)), 'Format tanggal tidak valid'),
  statusKehadiran: z.enum(
    [
      STATUS_KEHADIRAN.SAKIT,
      STATUS_KEHADIRAN.IZIN,
      STATUS_KEHADIRAN.WFH,
      STATUS_KEHADIRAN.TANPA_KETERANGAN,
      STATUS_KEHADIRAN.CUTI,
      STATUS_KEHADIRAN.CUTI_BAKU,
      STATUS_KEHADIRAN.SECURITY,
      STATUS_KEHADIRAN.TUGAS,
      STATUS_KEHADIRAN.BELUM_FINGERPRINT,
    ],
    { message: 'Status kehadiran tidak valid' }
  ),
  keterangan: z.string().max(500, 'Keterangan maksimal 500 karakter').optional().or(z.literal('')),
  diinputOleh: z.string().max(100, 'Nama maksimal 100 karakter').optional().or(z.literal('')),
});

export const updateAbsensiSchema = z.object({
  statusKehadiran: z
    .enum(
      [
        STATUS_KEHADIRAN.HADIR,
        STATUS_KEHADIRAN.SAKIT,
        STATUS_KEHADIRAN.IZIN,
        STATUS_KEHADIRAN.WFH,
        STATUS_KEHADIRAN.TANPA_KETERANGAN,
        STATUS_KEHADIRAN.CUTI,
        STATUS_KEHADIRAN.CUTI_BAKU,
        STATUS_KEHADIRAN.SECURITY,
        STATUS_KEHADIRAN.TUGAS,
        STATUS_KEHADIRAN.BELUM_FINGERPRINT,
      ],
      { message: 'Status kehadiran tidak valid' }
    )
    .optional(),
  keterangan: z.string().max(500, 'Keterangan maksimal 500 karakter').optional().or(z.literal('')),
  diinputOleh: z.string().max(100, 'Nama maksimal 100 karakter').optional().or(z.literal('')),
});

export type UploadFingerprintFormData = z.infer<typeof uploadFingerprintSchema>;
export type AbsensiManualFormData = z.infer<typeof absensiManualSchema>;
export type UpdateAbsensiFormData = z.infer<typeof updateAbsensiSchema>;
