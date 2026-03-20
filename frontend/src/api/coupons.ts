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
