import apiClient from './apiClient';

export const loginUser = async (name: string, password: string) => {
  const { data } = await apiClient.post('/user/login', { name, password });

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    group: data.group?.name,
  };
};