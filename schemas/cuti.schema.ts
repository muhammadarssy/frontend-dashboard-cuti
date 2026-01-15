import { z } from 'zod';
import { JENIS_CUTI } from '@/lib/constants';

export const cutiSchema = z.object({
  karyawanId: z.string({
    message: 'Karyawan wajib dipilih',
  }).uuid('ID karyawan tidak valid'),
  jenis: z.enum(
    [
      JENIS_CUTI.TAHUNAN,
      JENIS_CUTI.SAKIT,
      JENIS_CUTI.IZIN,
      JENIS_CUTI.BAKU,
      JENIS_CUTI.TANPA_KETERANGAN,
      JENIS_CUTI.LAINNYA,
    ],
    {
      message: 'Jenis cuti wajib dipilih',
    }
  ),
  alasan: z.string().max(500, 'Alasan maksimal 500 karakter').optional().or(z.literal('')),
  tanggalMulai: z
    .string()
    .min(1, 'Tanggal mulai wajib diisi')
    .refine((date) => !isNaN(Date.parse(date)), 'Format tanggal tidak valid'),
  tanggalSelesai: z
    .string()
    .min(1, 'Tanggal selesai wajib diisi')
    .refine((date) => !isNaN(Date.parse(date)), 'Format tanggal tidak valid'),
}).refine(
  (data) => new Date(data.tanggalSelesai) >= new Date(data.tanggalMulai),
  {
    message: 'Tanggal selesai harus setelah atau sama dengan tanggal mulai',
    path: ['tanggalSelesai'],
  }
);

export type CutiFormData = z.infer<typeof cutiSchema>;
