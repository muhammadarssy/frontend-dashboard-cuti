import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  Cuti,
  CreateCutiInput,
  CutiFilter,
  RekapAlasan,
  CutiSummary,
} from '@/types/cuti.types';
import { toast } from 'sonner';

const CUTI_KEYS = {
  all: ['cuti'] as const,
  lists: () => [...CUTI_KEYS.all, 'list'] as const,
  list: (filters: CutiFilter) => [...CUTI_KEYS.lists(), filters] as const,
  details: () => [...CUTI_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CUTI_KEYS.details(), id] as const,
  rekapAlasan: (tahun?: number) => [...CUTI_KEYS.all, 'rekap-alasan', tahun] as const,
  summary: (karyawanId: string, tahun?: number) => 
    [...CUTI_KEYS.all, 'summary', karyawanId, tahun] as const,
};

/**
 * Get all cuti with pagination
 */
export function useCuti(filters?: CutiFilter) {
  return useQuery({
    queryKey: CUTI_KEYS.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.karyawanId) params.append('karyawanId', filters.karyawanId);
      if (filters?.jenis) params.append('jenis', filters.jenis);
      if (filters?.tahun) params.append('tahun', filters.tahun.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get<ApiResponse<Cuti[]> | (ApiResponse<Cuti[]> & { pagination: any })>(
        `/cuti${params.toString() ? `?${params.toString()}` : ''}`
      );
      
      // Check if response has pagination
      if ('pagination' in response.data) {
        return {
          data: response.data.data || [],
          pagination: response.data.pagination,
        };
      }
      
      return {
        data: response.data.data || [],
        pagination: undefined,
      };
    },
  });
}

/**
 * Get cuti by ID
 */
export function useCutiById(id: string) {
  return useQuery({
    queryKey: CUTI_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Cuti>>(`/cuti/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Create cuti
 */
export function useCreateCuti() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCutiInput) => {
      const response = await api.post<ApiResponse<Cuti>>('/cuti', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUTI_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['cuti-tahunan'] });
      toast.success('Cuti berhasil ditambahkan');
    },
  });
}

/**
 * Delete cuti
 */
export function useDeleteCuti() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<Cuti>>(`/cuti/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUTI_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['cuti-tahunan'] });
      toast.success('Cuti berhasil dihapus dan saldo dikembalikan');
    },
  });
}

/**
 * Get rekap alasan cuti
 */
export function useRekapAlasan(tahun?: number) {
  return useQuery({
    queryKey: CUTI_KEYS.rekapAlasan(tahun),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (tahun) params.append('tahun', tahun.toString());
      
      const response = await api.get<ApiResponse<RekapAlasan[]>>(
        `/cuti/rekap/alasan${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data.data || [];
    },
  });
}

/**
 * Get summary by karyawan
 */
export function useCutiSummary(karyawanId: string, tahun?: number) {
  return useQuery({
    queryKey: CUTI_KEYS.summary(karyawanId, tahun),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (tahun) params.append('tahun', tahun.toString());
      
      const response = await api.get<ApiResponse<CutiSummary>>(
        `/cuti/summary/${karyawanId}${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data.data;
    },
    enabled: !!karyawanId,
  });
}
