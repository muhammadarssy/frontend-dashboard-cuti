'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STATUS_KEHADIRAN } from '@/lib/constants';
import { useCreateAbsensiManual } from '@/hooks/useAbsensi';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

interface QuickManualInputProps {
  karyawan: {
    id: string;
    nama: string;
    nik: string;
    jabatan: string | null;
    fingerprintId: number | null;
  };
  tanggal: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function QuickManualInput({ 
  karyawan, 
  tanggal, 
  onSuccess, 
  onCancel 
}: QuickManualInputProps) {
  const [statusKehadiran, setStatusKehadiran] = useState<string>('');
  const [keterangan, setKeterangan] = useState('');
  const [diinputOleh, setDiinputOleh] = useState('');
  
  const createMutation = useCreateAbsensiManual();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!statusKehadiran) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        karyawanId: karyawan.id,
        tanggal: new Date(tanggal).toISOString(),
        statusKehadiran: statusKehadiran as 'HADIR' | 'SAKIT' | 'IZIN' | 'WFH' | 'TANPA_KETERANGAN' | 'CUTI' | 'CUTI_BAKU' | 'SATPAM' | 'TUGAS',
        keterangan: keterangan || undefined,
        diinputOleh: diinputOleh || undefined,
      });
      
      onSuccess();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {/* Karyawan Info */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{karyawan.nama}</h4>
            <p className="text-sm text-gray-600">NIK: {karyawan.nik}</p>
            {karyawan.jabatan && (
              <p className="text-sm text-gray-600">{karyawan.jabatan}</p>
            )}
          </div>
          <Badge variant={karyawan.fingerprintId ? 'default' : 'secondary'}>
            {karyawan.fingerprintId ? `FP: ${karyawan.fingerprintId}` : 'No FP'}
          </Badge>
        </div>

        {/* Status Kehadiran */}
        <div className="space-y-2">
          <Label htmlFor={`status-${karyawan.id}`}>Status Kehadiran *</Label>
          <Select value={statusKehadiran} onValueChange={setStatusKehadiran}>
            <SelectTrigger id={`status-${karyawan.id}`}>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={STATUS_KEHADIRAN.SAKIT}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Sakit</span>
                </div>
              </SelectItem>
              <SelectItem value={STATUS_KEHADIRAN.IZIN}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <span>Izin</span>
                </div>
              </SelectItem>
              <SelectItem value={STATUS_KEHADIRAN.WFH}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-purple-500" />
                  <span>WFH</span>
                </div>
              </SelectItem>
              <SelectItem value={STATUS_KEHADIRAN.TANPA_KETERANGAN}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span>Tanpa Keterangan (Alpha)</span>
                </div>
              </SelectItem>
              <SelectItem value={STATUS_KEHADIRAN.CUTI}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>Cuti</span>
                </div>
              </SelectItem>
              <SelectItem value={STATUS_KEHADIRAN.CUTI_BAKU}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-teal-500" />
                  <span>Baku</span>
                </div>
              </SelectItem>
              <SelectItem value={STATUS_KEHADIRAN.SATPAM}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-indigo-500" />
                  <span>Satpam</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Keterangan */}
        <div className="space-y-2">
          <Label htmlFor={`keterangan-${karyawan.id}`}>Keterangan</Label>
          <Textarea
            id={`keterangan-${karyawan.id}`}
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Tambahkan keterangan (opsional)"
            rows={2}
            maxLength={500}
          />
        </div>

        {/* Diinput Oleh */}
        <div className="space-y-2">
          <Label htmlFor={`diinput-${karyawan.id}`}>Diinput Oleh</Label>
          <Input
            id={`diinput-${karyawan.id}`}
            value={diinputOleh}
            onChange={(e) => setDiinputOleh(e.target.value)}
            placeholder="Nama petugas (opsional)"
            maxLength={100}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!statusKehadiran || createMutation.isPending}
            className="flex-1"
            size="sm"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createMutation.isPending}
            size="sm"
          >
            <X className="h-4 w-4 mr-1" />
            Batal
          </Button>
        </div>
      </form>
  );
}
