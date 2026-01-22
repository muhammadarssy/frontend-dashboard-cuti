import { z } from 'zod';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const labelStrukSchema = z.object({
  nama: z.string().min(1, 'Nama label harus diisi').max(100, 'Nama label maksimal 100 karakter'),
  deskripsi: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional()
    .or(z.literal('')),
  warna: z
    .string()
    .regex(hexColorRegex, 'Format warna harus hex (contoh: #FF5733)')
    .optional()
    .or(z.literal('')),
  isAktif: z.boolean().optional(),
});

export type LabelStrukSchema = z.infer<typeof labelStrukSchema>;
