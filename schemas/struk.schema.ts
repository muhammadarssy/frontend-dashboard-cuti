import { z } from 'zod';

export const strukItemSchema = z.object({
  labelStrukId: z.string().uuid('Label harus dipilih'),
  kategoriBudgetId: z.string().uuid('Kategori budget harus dipilih'),
  namaItem: z.string().min(1, 'Nama item harus diisi').max(200, 'Nama item maksimal 200 karakter'),
  itemId: z.string().uuid('Item ID tidak valid').optional().or(z.literal('')),
  harga: z
    .number()
    .int('Harga harus bilangan bulat')
    .nonnegative('Harga tidak boleh negatif'),
  qty: z.number().int('Qty harus bilangan bulat').positive('Qty harus lebih dari 0'),
  discountType: z.enum(['BONUS', 'PERSEN']).optional(),
  discountValue: z
    .number()
    .nonnegative('Discount value tidak boleh negatif')
    .optional(),
  keterangan: z.string().max(500, 'Keterangan maksimal 500 karakter').optional().or(z.literal('')),
});

export const strukSchema = z
  .object({
    budgetId: z.string().uuid('Budget harus dipilih'),
    tanggal: z.string().min(1, 'Tanggal harus diisi'),
    nomorStruk: z.string().max(100, 'Nomor struk maksimal 100 karakter').optional().or(z.literal('')),
    fileBukti: z.string().optional().or(z.literal('')),
    namaFileAsli: z.string().optional().or(z.literal('')),
    items: z
      .array(strukItemSchema)
      .min(1, 'Minimal harus ada 1 item')
      .refine(
        (items) => {
          // Validasi discount: jika discountType ada, discountValue harus ada
          return items.every(
            (item) =>
              !item.discountType || (item.discountType && item.discountValue !== undefined)
          );
        },
        {
          message: 'Jika discount type diisi, discount value harus diisi',
        }
      ),
    taxPersen: z
      .number()
      .int('Tax persen harus bilangan bulat')
      .min(0, 'Tax persen minimal 0')
      .max(100, 'Tax persen maksimal 100')
      .optional(),
    taxNominal: z
      .number()
      .int('Tax nominal harus bilangan bulat')
      .nonnegative('Tax nominal tidak boleh negatif')
      .optional(),
    keterangan: z.string().max(500, 'Keterangan maksimal 500 karakter').optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      // Tax persen dan tax nominal hanya boleh salah satu
      const hasTaxPersen = data.taxPersen !== undefined && data.taxPersen !== null;
      const hasTaxNominal = data.taxNominal !== undefined && data.taxNominal !== null;
      return !(hasTaxPersen && hasTaxNominal);
    },
    {
      message: 'Tax persen dan tax nominal hanya boleh salah satu',
      path: ['taxPersen'],
    }
  );

export type StrukSchema = z.infer<typeof strukSchema>;
export type StrukItemSchema = z.infer<typeof strukItemSchema>;
