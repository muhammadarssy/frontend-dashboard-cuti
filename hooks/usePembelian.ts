import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Pembelian, PembelianFormData, RekapPembelian } from '@/types/pembelian.types';
import type { PaginatedResponse } from '@/types/api.types';

export const usePembelians = (
  itemId?: string,
  kategori?: string,
  supplier?: string,
  tanggalMulai?: string,
  tanggalSelesai?: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<PaginatedResponse<Pembelian>>({
    queryKey: ['pembelians', itemId, kategori, supplier, tanggalMulai, tanggalSelesai, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (itemId) params.append('itemId', itemId);
      if (kategori) params.append('kategori', kategori);
      if (supplier) params.append('supplier', supplier);
      if (tanggalMulai) params.append('tanggalMulai', tanggalMulai);
      if (tanggalSelesai) params.append('tanggalSelesai', tanggalSelesai);
      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await api.get(`/pembelian?${params.toString()}`);
      return response.data;
    },
  });
};

export const usePembelian = (id: string) => {
  return useQuery<Pembelian>({
    queryKey: ['pembelian', id],
    queryFn: async () => {
      const response = await api.get(`/pembelian/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useRekapPembelian = (
  kategori?: string,
  tanggalMulai?: string,
  tanggalSelesai?: string,
  groupBy: 'item' | 'supplier' = 'item'
) => {
  return useQuery<RekapPembelian>({
    queryKey: ['rekap-pembelian', kategori, tanggalMulai, tanggalSelesai, groupBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (kategori) params.append('kategori', kategori);
      if (tanggalMulai) params.append('tanggalMulai', tanggalMulai);
      if (tanggalSelesai) params.append('tanggalSelesai', tanggalSelesai);
      params.append('groupBy', groupBy);

      const response = await api.get(`/pembelian/rekap?${params.toString()}`);
      return response.data.data;
    },
    enabled: !!tanggalMulai && !!tanggalSelesai,
  });
};

export const useCreatePembelian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PembelianFormData) => {
      const response = await api.post('/pembelian', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pembelians'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['rekap-pembelian'] });
      toast.success('Pembelian berhasil ditambahkan');
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.error || 'Gagal menambahkan pembelian';
      toast.error(message);
    },
  });
};

export const useUpdatePembelian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PembelianFormData> }) => {
      const response = await api.put(`/pembelian/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pembelians'] });
      queryClient.invalidateQueries({ queryKey: ['pembelian', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['rekap-pembelian'] });
      toast.success('Pembelian berhasil diperbarui');
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.error || 'Gagal memperbarui pembelian';
      toast.error(message);
    },
  });
};

export const useDeletePembelian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/pembelian/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pembelians'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['rekap-pembelian'] });
      toast.success('Pembelian berhasil dihapus');
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.error || 'Gagal menghapus pembelian';
      toast.error(message);
    },
  });
};
