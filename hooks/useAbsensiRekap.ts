import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse } from '@/types/api.types';
import type {
  ParseRekapResult,
  ExportRekapPayload,
  ExportPdfPayload,
} from '@/types/absensi-rekap.types';
import { toast } from 'sonner';

/**
 * Upload file Excel rekap absensi → return data terstruktur untuk tabel
 * Data TIDAK disimpan ke DB
 */
export function useUploadRekap() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<ApiResponse<ParseRekapResult>>(
        '/absensi-rekap/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000,
        }
      );
      return response.data.data!;
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal memproses file rekap');
    },
  });
}

/**
 * Export data rekap ke file Excel (download langsung)
 */
export function useExportRekapExcel() {
  return useMutation({
    mutationFn: async (payload: ExportRekapPayload) => {
      const response = await api.post('/absensi-rekap/export/excel', payload, {
        responseType: 'blob',
        timeout: 30000,
      });

      // Trigger download di browser
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = payload.periodeLabel
        ? `Rekap_Absensi_${payload.periodeLabel.replace(/\s+/g, '_')}.xlsx`
        : 'Rekap_Absensi.xlsx';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('File Excel berhasil didownload');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal export Excel');
    },
  });
}

/**
 * Export data rekap ke PDF payload (JSON untuk render PDF di frontend)
 */
export function useExportRekapPdf() {
  return useMutation({
    mutationFn: async (payload: ExportRekapPayload) => {
      const response = await api.post<ApiResponse<ExportPdfPayload>>(
        '/absensi-rekap/export/pdf',
        payload,
        { timeout: 30000 }
      );
      return response.data.data!;
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal menyiapkan data PDF');
    },
  });
}
