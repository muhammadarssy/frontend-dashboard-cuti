import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Struk, StrukFormData, RekapLabel, RekapKategori } from '@/types/budget.types';
import type { PaginatedResponse, ApiResponse } from '@/types/api.types';

export const useStruks = (
  budgetId?: string,
  tahun?: number,
  bulan?: number,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery<PaginatedResponse<Struk>>({
    queryKey: ['struks', budgetId, tahun, bulan, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (budgetId) params.append('budgetId', budgetId);
      if (tahun) params.append('tahun', String(tahun));
      if (bulan) params.append('bulan', String(bulan));
      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await api.get(`/struk?${params.toString()}`);
      return response.data;
    },
  });
};

export const useStruk = (id: string) => {
  return useQuery<Struk>({
    queryKey: ['struk', id],
    queryFn: async () => {
      const response = await api.get(`/struk/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useRekapLabel = (budgetId?: string, tahun?: number, bulan?: number) => {
  return useQuery<ApiResponse<RekapLabel[]>>({
    queryKey: ['struk', 'rekap', 'label', budgetId, tahun, bulan],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (budgetId) params.append('budgetId', budgetId);
      if (tahun) params.append('tahun', String(tahun));
      if (bulan) params.append('bulan', String(bulan));

      const response = await api.get(`/struk/rekap/label?${params.toString()}`);
      return response.data;
    },
  });
};

export const useRekapKategori = (budgetId?: string, tahun?: number, bulan?: number) => {
  return useQuery<ApiResponse<RekapKategori[]>>({
    queryKey: ['struk', 'rekap', 'kategori', budgetId, tahun, bulan],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (budgetId) params.append('budgetId', budgetId);
      if (tahun) params.append('tahun', String(tahun));
      if (bulan) params.append('bulan', String(bulan));

      const response = await api.get(`/struk/rekap/kategori?${params.toString()}`);
      return response.data;
    },
  });
};

export const useCreateStruk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StrukFormData) => {
      const response = await api.post('/struk', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['struks'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['struk', 'rekap'] });
      toast.success('Struk berhasil ditambahkan');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal menambahkan struk';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};

export const useUpdateStruk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StrukFormData> }) => {
      const response = await api.put(`/struk/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['struks'] });
      queryClient.invalidateQueries({ queryKey: ['struk', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['struk', 'rekap'] });
      toast.success('Struk berhasil diperbarui');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal memperbarui struk';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};

export const useDeleteStruk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/struk/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['struks'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['struk', 'rekap'] });
      toast.success('Struk berhasil dihapus');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal menghapus struk';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};
