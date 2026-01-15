import { z } from 'zod';
import { STATUS_KARYAWAN } from '@/lib/constants';

export const karyawanSchema = z.object({
  nik: z
    .string()
    .min(1, 'NIK wajib diisi')
    .max(50, 'NIK maksimal 50 karakter'),
  fingerprintId: z
    .number({ message: 'Fingerprint ID harus berupa angka' })
    .int('Fingerprint ID harus berupa bilangan bulat')
    .positive('Fingerprint ID harus positif')
    .optional()
    .or(z.literal('')),
  nama: z
    .string()
    .min(1, 'Nama wajib diisi')
    .max(100, 'Nama maksimal 100 karakter'),
  jabatan: z.string().max(100, 'Jabatan maksimal 100 karakter').optional().or(z.literal('')),
  departemen: z.string().max(100, 'Departemen maksimal 100 karakter').optional().or(z.literal('')),
  tanggalMasuk: z
    .string()
    .min(1, 'Tanggal bergabung wajib diisi')
    .refine((date) => !isNaN(Date.parse(date)), 'Format tanggal tidak valid')
    .refine((date) => new Date(date) <= new Date(), 'Tanggal bergabung tidak boleh di masa depan'),
});

export const updateKaryawanSchema = z.object({
  fingerprintId: z
    .number({ message: 'Fingerprint ID harus berupa angka' })
    .int('Fingerprint ID harus berupa bilangan bulat')
    .positive('Fingerprint ID harus positif')
    .optional()
    .or(z.literal(''))
    .nullable(),
  nama: z.string().min(1, 'Nama wajib diisi').max(100, 'Nama maksimal 100 karakter').optional(),
  jabatan: z.string().max(100, 'Jabatan maksimal 100 karakter').optional().or(z.literal('')),
  departemen: z.string().max(100, 'Departemen maksimal 100 karakter').optional().or(z.literal('')),
  tanggalMasuk: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Format tanggal tidak valid')
    .refine((date) => new Date(date) <= new Date(), 'Tanggal bergabung tidak boleh di masa depan')
    .optional(),
  status: z.enum([STATUS_KARYAWAN.AKTIF, STATUS_KARYAWAN.NONAKTIF]).optional(),
});

export type KaryawanFormData = z.infer<typeof karyawanSchema>;
export type UpdateKaryawanFormData = z.infer<typeof updateKaryawanSchema>;
