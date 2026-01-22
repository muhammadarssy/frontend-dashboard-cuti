import { MainLayout } from '@/components/layout/MainLayout';

export default function StrukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
