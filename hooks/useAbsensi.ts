import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  Absensi,
  CreateAbsensiManualInput,
  UpdateAbsensiInput,
  UploadFingerprintResult,
  KaryawanBelumAbsen,
  AbsensiFilter,
  RingkasanAbsensi,
} from '@/types/absensi.types';
import { toast } from 'sonner';

const ABSENSI_KEYS = {
  all: ['absensi'] as const,
  lists: () => [...ABSENSI_KEYS.all, 'list'] as const,
  list: (filters: AbsensiFilter) => [...ABSENSI_KEYS.lists(), filters] as const,
  details: () => [...ABSENSI_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ABSENSI_KEYS.details(), id] as const,
  belumAbsen: (tanggal: string) => [...ABSENSI_KEYS.all, 'belum-absen', tanggal] as const,
  ringkasan: (tanggalMulai: string, tanggalSelesai: string, karyawanId?: string) =>
    [...ABSENSI_KEYS.all, 'ringkasan', tanggalMulai, tanggalSelesai, karyawanId] as const,
};

/**
 * Get all absensi with filters
 */
export function useAbsensi(filters?: AbsensiFilter) {
  return useQuery({
    queryKey: ABSENSI_KEYS.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.tanggalMulai) params.append('tanggalMulai', filters.tanggalMulai);
      if (filters?.tanggalSelesai) params.append('tanggalSelesai', filters.tanggalSelesai);
      if (filters?.karyawanId) params.append('karyawanId', filters.karyawanId);
      if (filters?.statusKehadiran) params.append('statusKehadiran', filters.statusKehadiran);
      if (filters?.isManual !== undefined) params.append('isManual', filters.isManual.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get<PaginatedResponse<Absensi>>(
        `/absensi${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data;
    },
  });
}

/**
 * Get absensi by ID
 */
export function useAbsensiById(id: string) {
  return useQuery({
    queryKey: ABSENSI_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Absensi>>(`/absensi/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Get karyawan yang belum absen
 */
export function useKaryawanBelumAbsen(tanggal: string) {
  return useQuery({
    queryKey: ABSENSI_KEYS.belumAbsen(tanggal),
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<{
          karyawan: KaryawanBelumAbsen[];
          total: number;
        }>
      >(`/absensi/belum-absen?tanggal=${tanggal}`);
      return response.data.data;
    },
    enabled: !!tanggal,
  });
}

/**
 * Get ringkasan absensi
 */
export function useRingkasanAbsensi(
  tanggalMulai: string,
  tanggalSelesai: string,
  karyawanId?: string
) {
  return useQuery({
    queryKey: ABSENSI_KEYS.ringkasan(tanggalMulai, tanggalSelesai, karyawanId),
    queryFn: async () => {
      const params = new URLSearchParams({
        tanggalMulai,
        tanggalSelesai,
      });
      if (karyawanId) params.append('karyawanId', karyawanId);

      const response = await api.get<ApiResponse<RingkasanAbsensi>>(
        `/absensi/ringkasan?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: !!tanggalMulai && !!tanggalSelesai,
  });
}

/**
 * Upload fingerprint Excel
 */
export function useUploadFingerprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, tanggal }: { file: File; tanggal: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tanggal', tanggal);

      const response = await api.post<ApiResponse<UploadFingerprintResult>>(
        '/absensi/upload-fingerprint',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ABSENSI_KEYS.lists() });
      if (data) {
        toast.success(
          `Upload berhasil! ${data.success} karyawan tercatat, ${data.notFound} tidak ditemukan, ${data.duplicate} duplikat`
        );
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal upload fingerprint');
    },
  });
}

/**
 * Create absensi manual
 */
export function useCreateAbsensiManual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAbsensiManualInput) => {
      const response = await api.post<ApiResponse<Absensi>>('/absensi/manual', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ABSENSI_KEYS.lists() });
      toast.success('Absensi manual berhasil dibuat');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal membuat absensi manual');
    },
  });
}

/**
 * Bulk create absensi manual
 */
export function useBulkCreateAbsensiManual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      karyawanIds: string[];
      tanggal: string;
      statusKehadiran: string;
      keterangan?: string;
      diinputOleh?: string;
    }) => {
      const response = await api.post<
        ApiResponse<{
          success: number;
          failed: number;
          duplicate: number;
          details: {
            created: string[];
            duplicates: string[];
            failed: Array<{ karyawanId: string; error: string }>;
          };
        }>
      >('/absensi/bulk-manual', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ABSENSI_KEYS.lists() });
      if (data) {
        toast.success(
          `Bulk input berhasil! ${data.success} berhasil, ${data.duplicate} duplikat, ${data.failed} gagal`
        );
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal bulk create absensi');
    },
  });
}

/**
 * Update absensi
 */
export function useUpdateAbsensi(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAbsensiInput) => {
      const response = await api.put<ApiResponse<Absensi>>(`/absensi/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ABSENSI_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ABSENSI_KEYS.detail(id) });
      toast.success('Absensi berhasil diupdate');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal update absensi');
    },
  });
}

/**
 * Delete absensi
 */
export function useDeleteAbsensi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/absensi/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ABSENSI_KEYS.lists() });
      toast.success('Absensi berhasil dihapus');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus absensi');
    },
  });
}
