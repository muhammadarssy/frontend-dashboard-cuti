export interface RekapAbsensiItem {
  empNo: string;
  noId: string;
  karyawanId: string | null;
  nik: string;
  nama: string;
  tanggal: string;          // YYYY-MM-DD
  jamMasuk: string | null;  // HH:MM atau null
  jamPulang: string | null;
  jamKerja: string | null;
  scanMasuk: string | null;
  scanPulang: string | null;
  keterangan: string | null;
}

export interface ParseRekapResult {
  data: RekapAbsensiItem[];
  notMatched: Array<{ empNo: string; nama: string; nik: string }>;
  totalRows: number;
  matchedRows: number;
  notMatchedRows: number;
}

export interface ExportRekapPayload {
  data: RekapAbsensiItem[];
  periodeLabel?: string;
}

export interface PdfPayloadColumn {
  key: string;
  label: string;
}

export interface PdfPayloadRow {
  no: number;
  noId: string;
  empNo: string;
  nik: string;
  nama: string;
  tanggal: string;
  scanMasuk: string;
  scanPulang: string;
  jamKerja: string;
  keterangan: string;
  _meta: {
    karyawanId: string | null;
    isMatched: boolean;
  };
}

export interface ExportPdfPayload {
  periodeLabel: string | null;
  generatedAt: string;
  summary: {
    totalRecords: number;
    totalKaryawan: number;
    totalTanggal: number;
  };
  columns: PdfPayloadColumn[];
  rows: PdfPayloadRow[];
}
