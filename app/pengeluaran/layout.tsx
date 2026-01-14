import { MainLayout } from '@/components/layout/MainLayout';

export default function PengeluaranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
