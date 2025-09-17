import httpClient from '../../services/utils/AxiosMiddleware';
import { IndicatorResponse } from './utils/indicatorDataUtils';

/**
 * 投诉工单测评满意率
 */
export const getTsSatOrderPre = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getTsSatOrderPre', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 投诉工单测评解决率
 */
export const getTsSatSolutionRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getTsSatSolutionRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 自助测评满意率
 */
export const getZiZuSatRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getZiZuSatRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 各触点测评解决率
 */
export const getCuDianSatRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getCuDianSatRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 语音客服即时满意率
 */
export const getInstSatisfactionRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getInstSatisfactionRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 语音客服即时解决率
 */
export const getResolutionRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getResolutionRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 文字客服即时满意率
 */
export const getIMInstantRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getIMInstantRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 文字客服即时解决率
 */
export const getIMSolveRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getIMSolveRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 远程柜台即时满意率
 */
export const getRemoteInstantRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getRemoteInstantRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 远程柜台即时解决率
 */
export const getRemoteSolveRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getRemoteSolveRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 移动故障用后即评10分满意率
 */
export const getYdOrderSatPre = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getYdOrderSatPre', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 宽带故障用后即评10分满意率
 */
export const getKdOrderSatPre = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getKdOrderSatPre', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 语音客服话后即评10分满意率
 */
export const getCommentAfterwards = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getCommentAfterwards', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 线上调查综合类十分满意率
 */
export const getXianShangSatRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getXianShangSatRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};
