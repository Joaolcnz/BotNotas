import apiClient from './apiClient';

export const getCoupons = async () => {
  const { data } = await apiClient.get('/coupons');
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
