import { z } from 'zod';

export const generateCutiTahunanSchema = z.object({
  karyawanId: z.string({
    message: 'Karyawan wajib dipilih',
  }).uuid('ID karyawan tidak valid'),
  tahun: z
    .number({
      message: 'Tahun wajib diisi',
    })
    .int('Tahun harus berupa bilangan bulat')
    .min(2020, 'Tahun minimal 2020')
    .max(2100, 'Tahun maksimal 2100'),
});

export const generateBulkSchema = z.object({
  tahun: z
    .number({
      message: 'Tahun wajib diisi',
    })
    .int('Tahun harus berupa bilangan bulat')
    .min(2020, 'Tahun minimal 2020')
    .max(2100, 'Tahun maksimal 2100'),
});

export type GenerateCutiTahunanFormData = z.infer<typeof generateCutiTahunanSchema>;
export type GenerateBulkFormData = z.infer<typeof generateBulkSchema>;
