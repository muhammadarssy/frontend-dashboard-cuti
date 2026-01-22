import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { KategoriBudget, KategoriBudgetFormData } from '@/types/budget.types';
import type { PaginatedResponse, ApiResponse } from '@/types/api.types';

export const useKategoriBudgets = (isAktif?: boolean, page: number = 1, limit: number = 50) => {
  return useQuery<PaginatedResponse<KategoriBudget>>({
    queryKey: ['kategori-budgets', isAktif, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (isAktif !== undefined) params.append('isAktif', String(isAktif));
      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await api.get(`/kategori-budget?${params.toString()}`);
      return response.data;
    },
  });
};

export const useActiveKategoriBudgets = () => {
  return useQuery<ApiResponse<KategoriBudget[]>>({
    queryKey: ['kategori-budgets', 'active'],
    queryFn: async () => {
      const response = await api.get('/kategori-budget/active');
      return response.data;
    },
  });
};

export const useKategoriBudget = (id: string) => {
  return useQuery<KategoriBudget>({
    queryKey: ['kategori-budget', id],
    queryFn: async () => {
      const response = await api.get(`/kategori-budget/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateKategoriBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: KategoriBudgetFormData) => {
      const response = await api.post('/kategori-budget', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-budgets'] });
      toast.success('Kategori budget berhasil ditambahkan');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message =
        errorData?.message || errorData?.error || 'Gagal menambahkan kategori budget';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};

export const useUpdateKategoriBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<KategoriBudgetFormData> }) => {
      const response = await api.put(`/kategori-budget/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kategori-budgets'] });
      queryClient.invalidateQueries({ queryKey: ['kategori-budget', variables.id] });
      toast.success('Kategori budget berhasil diperbarui');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message =
        errorData?.message || errorData?.error || 'Gagal memperbarui kategori budget';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};

export const useDeleteKategoriBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/kategori-budget/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-budgets'] });
      toast.success('Kategori budget berhasil dihapus');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal menghapus kategori budget';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};
