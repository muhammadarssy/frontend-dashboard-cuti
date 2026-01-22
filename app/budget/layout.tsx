import { MainLayout } from '@/components/layout/MainLayout';

export default function BudgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
