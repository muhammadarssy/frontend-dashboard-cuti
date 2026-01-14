import { MainLayout } from '@/components/layout/MainLayout';

export default function PembelianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
