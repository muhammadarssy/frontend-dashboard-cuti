import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse } from '@/types/api.types';
import type {
  Karyawan,
  CreateKaryawanInput,
  UpdateKaryawanInput,
  KaryawanFilter,
} from '@/types/karyawan.types';
import { toast } from 'sonner';

const KARYAWAN_KEYS = {
  all: ['karyawan'] as const,
  lists: () => [...KARYAWAN_KEYS.all, 'list'] as const,
  list: (filters: KaryawanFilter) => [...KARYAWAN_KEYS.lists(), filters] as const,
  details: () => [...KARYAWAN_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...KARYAWAN_KEYS.details(), id] as const,
};

/**
 * Get all karyawan
 */
export function useKaryawan(filters?: KaryawanFilter) {
  return useQuery({
    queryKey: KARYAWAN_KEYS.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      
      const response = await api.get<ApiResponse<Karyawan[]>>(
        `/karyawan${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data.data || [];
    },
  });
}

/**
 * Get karyawan by ID
 */
export function useKaryawanById(id: string) {
  return useQuery({
    queryKey: KARYAWAN_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Karyawan>>(`/karyawan/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Create karyawan
 */
export function useCreateKaryawan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateKaryawanInput) => {
      const response = await api.post<ApiResponse<Karyawan>>('/karyawan', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KARYAWAN_KEYS.lists() });
      toast.success('Karyawan berhasil ditambahkan');
    },
  });
}

/**
 * Update karyawan
 */
export function useUpdateKaryawan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateKaryawanInput }) => {
      const response = await api.put<ApiResponse<Karyawan>>(`/karyawan/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KARYAWAN_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KARYAWAN_KEYS.detail(variables.id) });
      toast.success('Karyawan berhasil diperbarui');
    },
  });
}

/**
 * Deactivate karyawan (soft delete)
 */
export function useDeactivateKaryawan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<Karyawan>>(`/karyawan/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KARYAWAN_KEYS.lists() });
      toast.success('Karyawan berhasil dinonaktifkan');
    },
  });
}
