import apiClient from './apiClient';

export const getUsers = async () => {
  const { data } = await apiClient.get('/user');
  return data.map((u: any) => ({
    ...u,
    group: u.group?.name || 'N/A',
    groupId: u.group?.id,
  }));
};

export const getUser = async (id: string) => {
  const { data } = await apiClient.get(`/user/${id}`);
  return {
    ...data,
    group: data.group?.name || 'N/A',
    groupId: data.group?.id,
  };
};

export const createUser = async (userData: { name: string; email: string; password: string; groupId: string }) => {
  const payload = {
    ...userData,
    groupId: Number(userData.groupId),
  };
  const { data } = await apiClient.post('/user', payload);
  return data;
};

export const updateUser = async (id: string, userData: Partial<{ name: string; email: string; password: string; groupId: string }>) => {
  const payload: any = { ...userData };
  
  if (userData.groupId) {
    payload.groupId = Number(userData.groupId);
  }
  
  // If password is empty string, remove it from payload to avoid overriding with empty
  if (payload.password === '') {
    delete payload.password;
  }

  const { data } = await apiClient.put(`/user/${id}`, payload);
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await apiClient.delete(`/user/${id}`);
  return data;
};
