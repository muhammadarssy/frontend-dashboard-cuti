import { z } from 'zod';

export const budgetSchema = z.object({
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
  totalBudget: z
    .number()
    .int('Total budget harus bilangan bulat')
    .positive('Total budget harus lebih dari 0'),
});

export type BudgetSchema = z.infer<typeof budgetSchema>;
