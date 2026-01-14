import { z } from 'zod';

export const pembelianSchema = z.object({
  itemId: z.string().uuid('Item harus dipilih'),
  jumlah: z.number().int('Jumlah harus bilangan bulat').positive('Jumlah harus lebih dari 0'),
  tanggal: z.string().min(1, 'Tanggal harus diisi'),
  supplier: z.string().max(200, 'Supplier maksimal 200 karakter').optional().or(z.literal('')),
  hargaSatuan: z.number().int('Harga satuan harus bilangan bulat').nonnegative('Harga satuan tidak boleh negatif'),
  keterangan: z.string().max(500, 'Keterangan maksimal 500 karakter').optional().or(z.literal('')),
});

export type PembelianSchema = z.infer<typeof pembelianSchema>;
