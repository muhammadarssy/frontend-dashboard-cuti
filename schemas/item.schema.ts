import { z } from 'zod';

export const itemSchema = z.object({
  kode: z.string().min(1, 'Kode harus diisi').max(50, 'Kode maksimal 50 karakter'),
  nama: z.string().min(1, 'Nama harus diisi').max(200, 'Nama maksimal 200 karakter'),
  kategori: z.enum(['ATK', 'OBAT'], {
    message: 'Kategori harus ATK atau OBAT',
  }),
  satuan: z.string().min(1, 'Satuan harus diisi').max(50, 'Satuan maksimal 50 karakter'),
  stokMinimal: z.number().int().nonnegative('Stok minimal tidak boleh negatif'),
  stokSekarang: z.number().int('Stok sekarang harus bilangan bulat'),
  keterangan: z.string().max(500, 'Keterangan maksimal 500 karakter').optional().or(z.literal('')),
});

export type ItemSchema = z.infer<typeof itemSchema>;
