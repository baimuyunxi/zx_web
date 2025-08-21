import httpClient from '../../services/utils/AxiosMiddleware';
import { IndicatorResponse } from './utils/indicatorDataUtils';

/**
 * 最严工单问题解决率
 */
export const getOrderSolve = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getOrderSolve', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 最严工单申告率
 */
export const getOrderDeclarAtion = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getOrderDeclarAtion', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 投诉处理重复率
 */
export const getOrderRepeat = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getOrderRepeat', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 移动故障工单重复率（万号办结
 */
export const getMoveOrder = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getMoveOrder', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 宽带故障工单重复率（万号办结）
 */
export const getBandOrder = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getBandOrder', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 投诉工单问题解决率（省内参评口径）
 */
export const getTsOrderSolve = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getTsOrderSolve', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 查询工单问题解决率（省内参评口径）
 */
export const getCxOrderSolve = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getCxOrderSolve', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 故障工单问题解决率（省内参评口径）
 */
export const getGzOrderSolve = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getGzOrderSolve', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 投诉工单及时率
 */
export const getTsOrderTimeRat = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getTsOrderTimeRat', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 投诉工单逾限且催单率
 */
export const getTsOrderOverRat = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getTsOrderOverRat', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 移动故障工单逾限且催单率
 */
export const getYdOrderOverRat = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getYdOrderOverRat', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 宽带故障工单逾限且催单率
 */
export const getKdOrderOverRat = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getKdOrderOverRat', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 宽带在线预处理率
 */
export const getKdOnlinePre = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getKdOnlinePre', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 宽带故障预处理及时率
 */
export const getKdOrderPre = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getKdOrderPre', {
    skipDuplicateCheck: true,
  });
  return response.data;
};
