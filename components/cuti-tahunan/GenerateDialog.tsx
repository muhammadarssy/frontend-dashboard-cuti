'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useGenerateCutiTahunan } from '@/hooks/useCutiTahunan';
import { useKaryawan } from '@/hooks/useKaryawan';
import { Loader2, Plus } from 'lucide-react';

export function GenerateDialog() {
  const [open, setOpen] = useState(false);
  const [karyawanId, setKaryawanId] = useState<string>('');
  const [tahun, setTahun] = useState<string>(new Date().getFullYear().toString());

  const { data: karyawanList, isLoading: loadingKaryawan } = useKaryawan();
  const generateMutation = useGenerateCutiTahunan();

  const handleGenerate = () => {
    if (!karyawanId) {
      return;
    }

    generateMutation.mutate(
      {
        karyawanId: karyawanId,
        tahun: parseInt(tahun),
      },
      {
        onSuccess: () => {
          setOpen(false);
          setKaryawanId('');
        },
      }
    );
  };

  // Generate tahun options (current year + 2 years forward)
  const tahunOptions = Array.from({ length: 3 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return year.toString();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Generate Cuti Tahunan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Hak Cuti Tahunan</DialogTitle>
          <DialogDescription>
            Generate hak cuti tahunan untuk karyawan tertentu
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="karyawan">Karyawan</Label>
            <Select value={karyawanId} onValueChange={setKaryawanId}>
              <SelectTrigger id="karyawan">
                <SelectValue placeholder="Pilih karyawan" />
              </SelectTrigger>
              <SelectContent>
                {loadingKaryawan && (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                )}
                {karyawanList?.map((karyawan) => (
                  <SelectItem key={karyawan.id} value={karyawan.id}>
                    {karyawan.nik} - {karyawan.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tahun">Tahun</Label>
            <Select value={tahun} onValueChange={setTahun}>
              <SelectTrigger id="tahun">
                <SelectValue placeholder="Pilih tahun" />
              </SelectTrigger>
              <SelectContent>
                {tahunOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
            <p className="font-medium mb-1">ℹ️ Informasi</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Sistem akan otomatis menghitung prorate untuk tahun pertama</li>
              <li>Sisa cuti tahun sebelumnya akan ditambahkan (carry forward)</li>
              <li>Jatah penuh 12 hari untuk tahun kedua dan seterusnya</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={generateMutation.isPending}>
            Batal
          </Button>
          <Button onClick={handleGenerate} disabled={!karyawanId || generateMutation.isPending}>
            {generateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
