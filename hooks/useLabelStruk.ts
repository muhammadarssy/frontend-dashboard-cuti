import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { LabelStruk, LabelStrukFormData } from '@/types/budget.types';
import type { PaginatedResponse, ApiResponse } from '@/types/api.types';

export const useLabelStruks = (isAktif?: boolean, page: number = 1, limit: number = 50) => {
  return useQuery<PaginatedResponse<LabelStruk>>({
    queryKey: ['label-struks', isAktif, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (isAktif !== undefined) params.append('isAktif', String(isAktif));
      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await api.get(`/label-struk?${params.toString()}`);
      return response.data;
    },
  });
};

export const useActiveLabelStruks = () => {
  return useQuery<ApiResponse<LabelStruk[]>>({
    queryKey: ['label-struks', 'active'],
    queryFn: async () => {
      const response = await api.get('/label-struk/active');
      return response.data;
    },
  });
};

export const useLabelStruk = (id: string) => {
  return useQuery<LabelStruk>({
    queryKey: ['label-struk', id],
    queryFn: async () => {
      const response = await api.get(`/label-struk/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateLabelStruk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LabelStrukFormData) => {
      const response = await api.post('/label-struk', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['label-struks'] });
      toast.success('Label berhasil ditambahkan');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal menambahkan label';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};

export const useUpdateLabelStruk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LabelStrukFormData> }) => {
      const response = await api.put(`/label-struk/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['label-struks'] });
      queryClient.invalidateQueries({ queryKey: ['label-struk', variables.id] });
      toast.success('Label berhasil diperbarui');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal memperbarui label';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};

export const useDeleteLabelStruk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/label-struk/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['label-struks'] });
      toast.success('Label berhasil dihapus');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal menghapus label';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};
