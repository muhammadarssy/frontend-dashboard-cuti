import { MainLayout } from '@/components/layout/MainLayout';

export default function ItemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
