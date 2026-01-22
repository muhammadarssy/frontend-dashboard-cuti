import { z } from 'zod';

export const kategoriBudgetSchema = z.object({
  nama: z.string().min(1, 'Nama kategori harus diisi').max(100, 'Nama kategori maksimal 100 karakter'),
  deskripsi: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional()
    .or(z.literal('')),
  isAktif: z.boolean().optional(),
});

export type KategoriBudgetSchema = z.infer<typeof kategoriBudgetSchema>;
