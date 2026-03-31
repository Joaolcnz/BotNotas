import apiClient from './apiClient';

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;       // current page (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  status: 'PENDING' | 'ATTACHED' | 'ERROR';
  group: { id: number; name: string };
  uploadedAt: string;
  processedAt: string | null;
}

export const getCoupons = async (
  page = 0,
  size = 20,
  sort = 'uploadedAt,desc'
): Promise<SpringPage<Coupon>> => {
  const { data } = await apiClient.get('/coupons', {
    params: { page, size, sort },
  });
  return data;
};

export const uploadCoupons = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('file', file);
  });
  const { data } = await apiClient.post('/coupons', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getExecutorStatus = async () => {
  const { data } = await apiClient.get('/coupons/executor/status');
  return data;
};

export const pauseExecutor = async () => {
  await apiClient.post('/coupons/executor/pause');
};

export const resumeExecutor = async () => {
  await apiClient.post('/coupons/executor/resume');
};
