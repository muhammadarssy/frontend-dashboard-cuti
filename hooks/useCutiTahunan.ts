import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  CutiTahunan,
  GenerateCutiTahunanInput,
  GenerateBulkResult,
  CutiTahunanFilter,
} from '@/types/cuti-tahunan.types';
import { toast } from 'sonner';

const CUTI_TAHUNAN_KEYS = {
  all: ['cuti-tahunan'] as const,
  lists: () => [...CUTI_TAHUNAN_KEYS.all, 'list'] as const,
  list: (filters: CutiTahunanFilter) => [...CUTI_TAHUNAN_KEYS.lists(), filters] as const,
  details: () => [...CUTI_TAHUNAN_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CUTI_TAHUNAN_KEYS.details(), id] as const,
};

/**
 * Get all cuti tahunan
 */
export function useCutiTahunan(filters?: CutiTahunanFilter) {
  return useQuery({
    queryKey: CUTI_TAHUNAN_KEYS.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.tahun) params.append('tahun', filters.tahun.toString());
      if (filters?.karyawanId) params.append('karyawanId', filters.karyawanId);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get<PaginatedResponse<CutiTahunan>>(
        `/cuti-tahunan${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data;
    },
  });
}

/**
 * Get cuti tahunan by ID
 */
export function useCutiTahunanById(id: string) {
  return useQuery({
    queryKey: CUTI_TAHUNAN_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<CutiTahunan>>(`/cuti-tahunan/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Generate cuti tahunan for single karyawan or bulk
 * If karyawanId is provided, generates for single karyawan
 * If karyawanId is not provided, generates for all active karyawan (bulk)
 */
export function useGenerateCutiTahunan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateCutiTahunanInput) => {
      const response = await api.post<ApiResponse<CutiTahunan | GenerateBulkResult>>(
        '/cuti-tahunan/generate',
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CUTI_TAHUNAN_KEYS.lists() });
      
      // Check if bulk result
      if (data && 'success' in data && 'failed' in data) {
        toast.success(`Generate selesai: ${data.success} berhasil, ${data.failed} gagal`);
      } else {
        toast.success('Hak cuti tahunan berhasil di-generate');
      }
    },
  });
}
