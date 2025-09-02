import httpClient from '../../../services/utils/AxiosMiddleware';

export const getIvrTopRank = async (): Promise<any> => {
  const response = await httpClient.get('/api/getIvrTopRank', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

export const getIvrBoard = async (): Promise<any> => {
  const response = await httpClient.get('/api/getIvrBoard', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

export const getIvrTrend = async (): Promise<any> => {
  const response = await httpClient.get('/api/getIvrTrend', {
    skipDuplicateCheck: true,
  });
  return response.data;
};
