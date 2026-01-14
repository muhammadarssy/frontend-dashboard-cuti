import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Item, ItemFormData, ItemStokMenipis } from '@/types/item.types';
import type { PaginatedResponse } from '@/types/api.types';

export const useItems = (
  kategori?: string,
  kode?: string,
  nama?: string,
  stokMenipis?: boolean,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<PaginatedResponse<Item>>({
    queryKey: ['items', kategori, kode, nama, stokMenipis, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (kategori) params.append('kategori', kategori);
      if (kode) params.append('kode', kode);
      if (nama) params.append('nama', nama);
      if (stokMenipis !== undefined) params.append('stokMenipis', String(stokMenipis));
      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await api.get(`/item?${params.toString()}`);
      return response.data;
    },
  });
};

export const useItem = (id: string) => {
  return useQuery<Item>({
    queryKey: ['item', id],
    queryFn: async () => {
      const response = await api.get(`/item/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useStokMenipis = (kategori?: string) => {
  return useQuery<ItemStokMenipis[]>({
    queryKey: ['stok-menipis', kategori],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (kategori) params.append('kategori', kategori);

      const response = await api.get(`/item/stok-menipis?${params.toString()}`);
      return response.data.data;
    },
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ItemFormData) => {
      const response = await api.post('/item', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['stok-menipis'] });
      toast.success('Item berhasil ditambahkan');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal menambahkan item';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ItemFormData> }) => {
      const response = await api.put(`/item/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['stok-menipis'] });
      toast.success('Item berhasil diperbarui');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal memperbarui item';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/item/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['stok-menipis'] });
      toast.success('Item berhasil dihapus');
    },
    onError: (error: unknown) => {
      const errorData = (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data;
      const message = errorData?.message || errorData?.error || 'Gagal menghapus item';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    },
  });
};
