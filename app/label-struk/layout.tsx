import { MainLayout } from '@/components/layout/MainLayout';

export default function LabelStrukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
