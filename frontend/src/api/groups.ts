import apiClient from './apiClient';

export const getGroups = async () => {
  const { data } = await apiClient.get('/group');
  return data;
};

export const createGroup = async (groupData: { name: string; locality: string; frotaflexUser: string; frotaflexPassword: string }) => {
  const { data } = await apiClient.post('/group', groupData);
  return data;
};

export const updateGroup = async (id: string, groupData: Partial<{ name: string; locality: string; frotaflexUser: string; frotaflexPassword: string }>) => {
  const { data } = await apiClient.put(`/group/${id}`, groupData);
  return data;
};

export const deleteGroup = async (id: string) => {
  const { data } = await apiClient.delete(`/group/${id}`);
  return data;
};

export const activateGroup = async (id: string) => {
  const { data } = await apiClient.put(`/group/${id}/activate`);
  return data;
};

export const disableGroup = async (id: string) => {
  const { data } = await apiClient.put(`/group/${id}/disable`);
  return data;
};
