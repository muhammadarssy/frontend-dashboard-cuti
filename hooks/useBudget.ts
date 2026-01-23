import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import type {
  Budget,
  BudgetFormData,
  BudgetSummary,
} from '@/types/budget.types';
import type { PaginatedResponse } from '@/types/api.types';

export const useBudgets = (tahun?: number, page: number = 1, limit: number = 20) => {
  return useQuery<PaginatedResponse<Budget>>({
    queryKey: ['budgets', tahun, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (tahun) params.append('tahun', String(tahun));
      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await api.get(`/budget?${params.toString()}`);
      return response.data;
    },
  });
};

export const useBudget = (id: string) => {
  return useQuery<Budget>({
    queryKey: ['budget', id],
    queryFn: async () => {
      const response = await api.get(`/budget/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useBudgetByBulanTahun = (bulan: number, tahun: number) => {
  return useQuery<Budget>({
    queryKey: ['budget', 'bulan', bulan, 'tahun', tahun],
    queryFn: async () => {
      const response = await api.get(`/budget/bulan/${bulan}/tahun/${tahun}`);
      return response.data.data;
    },
    enabled: !!bulan && !!tahun,
  });
};

export const useBudgetSummary = (id: string) => {
  return useQuery<BudgetSummary>({
    queryKey: ['budget', id, 'summary'],
    queryFn: async () => {
      const response = await api.get(`/budget/${id}/summary`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BudgetFormData) => {
      const response = await api.post('/budget', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget berhasil ditambahkan');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal menambahkan budget';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BudgetFormData> }) => {
      const response = await api.put(`/budget/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['budget', variables.id, 'summary'] });
      toast.success('Budget berhasil diperbarui');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal memperbarui budget';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/budget/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget berhasil dihapus');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal menghapus budget';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};
