'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STATUS_KEHADIRAN } from '@/lib/constants';
import { useBulkCreateAbsensiManual } from '@/hooks/useAbsensi';
import { CheckCircle, X, AlertCircle, Users } from 'lucide-react';

interface BulkManualInputProps {
  karyawanIds: string[];
  karyawanCount: number;
  tanggal: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BulkManualInput({ 
  karyawanIds,
  karyawanCount,
  tanggal, 
  onSuccess, 
  onCancel 
}: BulkManualInputProps) {
  const [statusKehadiran, setStatusKehadiran] = useState<string>('');
  const [keterangan, setKeterangan] = useState('');
  const [diinputOleh, setDiinputOleh] = useState('');
  
  const bulkMutation = useBulkCreateAbsensiManual();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!statusKehadiran) {
      return;
    }

    try {
      await bulkMutation.mutateAsync({
        karyawanIds: karyawanIds,
        tanggal: new Date(tanggal).toISOString(),
        statusKehadiran: statusKehadiran as 'HADIR' | 'SAKIT' | 'IZIN' | 'WFH' | 'TANPA_KETERANGAN' | 'CUTI' | 'CUTI_BAKU' | 'SECURITY' | 'TUGAS' | 'BELUM_FINGERPRINT',
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
      {/* Info */}
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Users className="h-5 w-5 text-blue-600" />
        <div>
          <p className="font-semibold text-blue-900">Input Bulk untuk {karyawanCount} Karyawan</p>
          <p className="text-sm text-blue-700">Semua karyawan akan diset dengan status yang sama</p>
        </div>
      </div>

      {/* Status Kehadiran */}
      <div className="space-y-2">
        <Label htmlFor="status-bulk">Status Kehadiran *</Label>
        <Select value={statusKehadiran} onValueChange={setStatusKehadiran}>
          <SelectTrigger id="status-bulk">
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
                <span>Cuti Baku</span>
              </div>
            </SelectItem>
            <SelectItem value={STATUS_KEHADIRAN.SECURITY}>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-indigo-500" />
                <span>Security</span>
              </div>
            </SelectItem>
            <SelectItem value={STATUS_KEHADIRAN.TUGAS}>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span>Tugas</span>
              </div>
            </SelectItem>
            <SelectItem value={STATUS_KEHADIRAN.BELUM_FINGERPRINT}>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-slate-500" />
                <span>Belum Fingerprint</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Keterangan */}
      <div className="space-y-2">
        <Label htmlFor="keterangan-bulk">Keterangan</Label>
        <Textarea
          id="keterangan-bulk"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          placeholder="Tambahkan keterangan (opsional)"
          rows={3}
          maxLength={500}
        />
      </div>

      {/* Diinput Oleh */}
      <div className="space-y-2">
        <Label htmlFor="diinput-bulk">Diinput Oleh</Label>
        <Input
          id="diinput-bulk"
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
          disabled={!statusKehadiran || bulkMutation.isPending}
          className="flex-1"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {bulkMutation.isPending ? 'Menyimpan...' : `Simpan ${karyawanCount} Data`}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={bulkMutation.isPending}
        >
          <X className="h-4 w-4 mr-1" />
          Batal
        </Button>
      </div>
    </form>
  );
}
