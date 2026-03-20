import apiClient from './apiClient';

export const getCoupons = async () => {
  const { data } = await apiClient.get('/coupons');
  return data;
};

export const uploadCoupon = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post('/coupons', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
