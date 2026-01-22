import { z } from 'zod';

export const budgetRincianSchema = z.object({
  kategoriBudgetId: z.string().uuid('Kategori budget harus dipilih'),
  alokasi: z
    .number()
    .int('Alokasi harus bilangan bulat')
    .positive('Alokasi harus lebih dari 0'),
});

export const budgetSchema = z
  .object({
    bulan: z
      .number()
      .int('Bulan harus bilangan bulat')
      .min(1, 'Bulan harus antara 1-12')
      .max(12, 'Bulan harus antara 1-12'),
    tahun: z
      .number()
      .int('Tahun harus bilangan bulat')
      .min(2000, 'Tahun harus valid')
      .max(2100, 'Tahun harus valid'),
    rincian: z
      .array(budgetRincianSchema)
      .min(1, 'Minimal harus ada 1 kategori budget')
      .refine(
        (rincian) => {
          // Validasi: tidak boleh ada kategori yang duplikat
          const kategoriIds = rincian.map((r) => r.kategoriBudgetId);
          return new Set(kategoriIds).size === kategoriIds.length;
        },
        {
          message: 'Kategori budget tidak boleh duplikat',
        }
      ),
  })
  .refine(
    (data) => {
      // Validasi: total alokasi harus > 0
      const totalAlokasi = data.rincian.reduce((sum, r) => sum + r.alokasi, 0);
      return totalAlokasi > 0;
    },
    {
      message: 'Total alokasi harus lebih dari 0',
    }
  );

export type BudgetSchema = z.infer<typeof budgetSchema>;
export type BudgetRincianSchema = z.infer<typeof budgetRincianSchema>;
