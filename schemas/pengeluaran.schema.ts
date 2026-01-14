import { z } from 'zod';

export const pengeluaranSchema = z.object({
  itemId: z.string().uuid('Item harus dipilih'),
  jumlah: z.number().int('Jumlah harus bilangan bulat').positive('Jumlah harus lebih dari 0'),
  tanggal: z.string().min(1, 'Tanggal harus diisi'),
  keperluan: z.string().min(1, 'Keperluan harus diisi').max(200, 'Keperluan maksimal 200 karakter'),
  penerima: z.string().max(200, 'Penerima maksimal 200 karakter').optional().or(z.literal('')),
  keterangan: z.string().max(500, 'Keterangan maksimal 500 karakter').optional().or(z.literal('')),
});

export type PengeluaranSchema = z.infer<typeof pengeluaranSchema>;
