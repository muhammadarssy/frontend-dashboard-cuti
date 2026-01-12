'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CutiTahunan } from '@/types/cuti-tahunan.types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CutiTahunanTableProps {
  data: CutiTahunan[];
  isLoading?: boolean;
}

export function CutiTahunanTable({ data, isLoading }: CutiTahunanTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIK</TableHead>
              <TableHead>Nama Karyawan</TableHead>
              <TableHead>Tahun</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead className="text-right">Saldo Awal</TableHead>
              <TableHead className="text-right">Terpakai</TableHead>
              <TableHead className="text-right">Sisa</TableHead>
              <TableHead>Kadaluarsa</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={8} className="h-16">
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIK</TableHead>
              <TableHead>Nama Karyawan</TableHead>
              <TableHead>Tahun</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead className="text-right">Saldo Awal</TableHead>
              <TableHead className="text-right">Terpakai</TableHead>
              <TableHead className="text-right">Sisa</TableHead>
              <TableHead>Kadaluarsa</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <p className="text-lg font-medium">Tidak ada data</p>
                  <p className="text-sm">Silakan generate hak cuti tahunan terlebih dahulu</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NIK</TableHead>
            <TableHead>Nama Karyawan</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead className="text-right">Saldo Awal</TableHead>
            <TableHead className="text-right">Terpakai</TableHead>
            <TableHead className="text-right">Sisa</TableHead>
            <TableHead>Kadaluarsa</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const sisaCutiLow = item.sisaCuti < 3;
            
            return (
              <TableRow key={item.id}>
                <TableCell className="font-mono">{item.karyawan?.nik || '-'}</TableCell>
                <TableCell className="font-medium">{item.karyawan?.nama || '-'}</TableCell>
                <TableCell>{item.tahun}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {item.tipe?.replace('_', ' ').toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{item.jatahDasar} hari</TableCell>
                <TableCell className="text-right">{item.cutiTerpakai} hari</TableCell>
                <TableCell className="text-right">
                  <span className={sisaCutiLow ? 'text-orange-600 font-semibold' : ''}>
                    {item.sisaCuti} hari
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/cuti-tahunan/${item.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
