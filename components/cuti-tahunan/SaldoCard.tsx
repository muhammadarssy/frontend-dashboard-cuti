'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CutiTahunan } from '@/types/cuti-tahunan.types';

interface SaldoCardProps {
  data: CutiTahunan;
}

export function SaldoCard({ data }: SaldoCardProps) {
  const percentage = (data.sisaCuti / data.jatahDasar) * 100;
  const isLow = percentage < 25;
  const isMedium = percentage >= 25 && percentage < 50;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Saldo Cuti {data.tahun}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-3xl font-bold">{data.sisaCuti}</p>
            <p className="text-sm text-gray-500">dari {data.jatahDasar} hari</p>
          </div>
          <Badge variant={isLow ? 'destructive' : isMedium ? 'secondary' : 'default'}>
            {Math.round(percentage)}%
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Terpakai:</span>
            <span className="font-medium">{data.cutiTerpakai} hari</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tipe Pemberian:</span>
            <span className="font-medium capitalize">
              {data.tipe?.replace('_', ' ').toLowerCase()}
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isLow ? 'bg-red-500' : isMedium ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
