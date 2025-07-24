import httpClient from '../../services/utils/AxiosMiddleware';
import { IndicatorResponse } from './utils/indicatorDataUtils';

/**
 * 智能语音客服占比
 */
export const getLigentCus = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getLigentCus', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 智能客服转人工率
 */
export const getLigentrgRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getLigentrgRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 在线客服比（省内口径）
 */
export const getOnlineCustRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getOnlineCustRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 智能客服来话一解率
 */
export const getIntellSoluRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getIntellSoluRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 语音客服15s接通率
 */
export const getSeifServiceRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getSeifServiceRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 10000号总体呼入量
 */
export const getArtConn = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getArtConn', {
    skipDuplicateCheck: true,
  });
  return response.data;
};
