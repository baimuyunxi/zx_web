import httpClient from '../../services/utils/AxiosMiddleware';
import { IndicatorResponse } from './utils/indicatorDataUtils';

/**
 * 语音客服15s接通率
 */
export const getConn15Rate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getConn15Rate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 10000号适老化接通率
 */
export const getArtConnRt = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getArtConnRt', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 10000号人工一解率
 */
export const getOnceRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getOnceRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 语音人工呼入量
 */
export const getArtCallinCt = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getArtCallinCt', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 文字客服5分钟接通率
 */
export const getWord5Rate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getWord5Rate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 远程柜台25秒接通率
 */
export const getFarCabinetRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getFarCabinetRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 10000号重复来电率
 */
export const getRepeatRate = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getRepeatRate', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 万号人工话务总量
 */
export const getWanHaoCt = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getWanHaoCt', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 文字客服呼入量
 */
export const getWordCallinCt = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getWordCallinCt', {
    skipDuplicateCheck: true,
  });
  return response.data;
};

/**
 * 远程柜台呼入量
 */
export const getFarCabinetCt = async (): Promise<IndicatorResponse> => {
  const response = await httpClient.get('/api/getFarCabinetCt', {
    skipDuplicateCheck: true,
  });
  return response.data;
};
