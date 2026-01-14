import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Pengeluaran, PengeluaranFormData, RekapPengeluaran } from '@/types/pengeluaran.types';
import type { PaginatedResponse } from '@/types/api.types';

export const usePengeluarans = (
  itemId?: string,
  kategori?: string,
  keperluan?: string,
  penerima?: string,
  tanggalMulai?: string,
  tanggalSelesai?: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<PaginatedResponse<Pengeluaran>>({
    queryKey: ['pengeluarans', itemId, kategori, keperluan, penerima, tanggalMulai, tanggalSelesai, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (itemId) params.append('itemId', itemId);
      if (kategori) params.append('kategori', kategori);
      if (keperluan) params.append('keperluan', keperluan);
      if (penerima) params.append('penerima', penerima);
      if (tanggalMulai) params.append('tanggalMulai', tanggalMulai);
      if (tanggalSelesai) params.append('tanggalSelesai', tanggalSelesai);
      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await api.get(`/pengeluaran?${params.toString()}`);
      return response.data;
    },
  });
};

export const usePengeluaran = (id: string) => {
  return useQuery<Pengeluaran>({
    queryKey: ['pengeluaran', id],
    queryFn: async () => {
      const response = await api.get(`/pengeluaran/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useRekapPengeluaran = (
  kategori?: string,
  tanggalMulai?: string,
  tanggalSelesai?: string,
  groupBy: 'item' | 'keperluan' | 'penerima' = 'item'
) => {
  return useQuery<RekapPengeluaran>({
    queryKey: ['rekap-pengeluaran', kategori, tanggalMulai, tanggalSelesai, groupBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (kategori) params.append('kategori', kategori);
      if (tanggalMulai) params.append('tanggalMulai', tanggalMulai);
      if (tanggalSelesai) params.append('tanggalSelesai', tanggalSelesai);
      params.append('groupBy', groupBy);

      const response = await api.get(`/pengeluaran/rekap?${params.toString()}`);
      return response.data.data;
    },
    enabled: !!tanggalMulai && !!tanggalSelesai,
  });
};

export const useCreatePengeluaran = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PengeluaranFormData) => {
      const response = await api.post('/pengeluaran', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluarans'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['rekap-pengeluaran'] });
      toast.success('Pengeluaran berhasil ditambahkan');
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.error || 'Gagal menambahkan pengeluaran';
      toast.error(message);
    },
  });
};

export const useUpdatePengeluaran = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PengeluaranFormData> }) => {
      const response = await api.put(`/pengeluaran/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pengeluarans'] });
      queryClient.invalidateQueries({ queryKey: ['pengeluaran', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['rekap-pengeluaran'] });
      toast.success('Pengeluaran berhasil diperbarui');
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.error || 'Gagal memperbarui pengeluaran';
      toast.error(message);
    },
  });
};

export const useDeletePengeluaran = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/pengeluaran/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluarans'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['rekap-pengeluaran'] });
      toast.success('Pengeluaran berhasil dihapus');
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.error || 'Gagal menghapus pengeluaran';
      toast.error(message);
    },
  });
};
