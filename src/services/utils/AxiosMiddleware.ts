import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

// 请求配置接口
interface RequestConfig extends AxiosRequestConfig {
  skipDuplicateCheck?: boolean; // 是否跳过重复请求检查
  showLoading?: boolean; // 是否显示加载状态
  showErrorMessage?: boolean; // 是否显示错误消息
}

// Token 管理接口
interface TokenManager {
  getToken(): string | null;

  setToken(token: string): void;

  clearToken(): void;

  refreshToken(): Promise<string>;
}

// 请求记录接口
interface PendingRequest {
  url: string;
  method: string;
  params: string;
  cancel: () => void;
}

class AxiosMiddleware {
  private readonly axiosInstance: AxiosInstance;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private tokenManager: TokenManager;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor(baseURL: string = '', tokenManager?: TokenManager) {
    // 创建 axios 实例
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 默认 Token 管理器
    this.tokenManager = tokenManager || {
      getToken: () => localStorage.getItem('access_token'),
      setToken: (token: string) => localStorage.setItem('access_token', token),
      clearToken: () => localStorage.removeItem('access_token'),
      refreshToken: async () => {
        // 这里应该调用你的刷新 token 接口
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/api/auth/refresh', {
          refresh_token: refreshToken,
        });
        return response.data.access_token;
      },
    };

    this.setupInterceptors();
  }

  // GET 请求
  public get<T = any>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(url, config);
  }

  // POST 请求
  public post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(url, data, config);
  }

  // PUT 请求
  public put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(url, data, config);
  }

  // DELETE 请求
  public delete<T = any>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete(url, config);
  }

  // PATCH 请求
  public patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch(url, data, config);
  }

  // 取消所有待处理的请求
  public cancelAllRequests(): void {
    this.pendingRequests.forEach((request) => {
      request.cancel();
    });
    this.pendingRequests.clear();
  }

  // 取消特定请求
  public cancelRequest(url: string, method: string = 'GET'): void {
    const key = `${method.toUpperCase()}_${url}__`;
    for (const [requestKey, request] of this.pendingRequests.entries()) {
      if (requestKey.startsWith(key)) {
        request.cancel();
        this.pendingRequests.delete(requestKey);
        break;
      }
    }
  }

  // 设置 Token
  public setToken(token: string): void {
    this.tokenManager.setToken(token);
  }

  // 清除 Token
  public clearToken(): void {
    this.tokenManager.clearToken();
  }

  // 获取 axios 实例（用于需要自定义配置的场景）
  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // 设置拦截器
  private setupInterceptors(): void {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        const requestConfig = config as RequestConfig;

        // 生成请求唯一标识
        const requestKey = this.generateRequestKey(config);

        // 检查重复请求
        if (!requestConfig.skipDuplicateCheck && this.pendingRequests.has(requestKey)) {
          const controller = new AbortController();
          config.signal = controller.signal;
          controller.abort();
          return Promise.reject(new Error('重复请求已被拦截'));
        }

        // 添加取消令牌
        const controller = new AbortController();
        config.signal = controller.signal;

        // 记录请求
        if (!requestConfig.skipDuplicateCheck) {
          this.pendingRequests.set(requestKey, {
            url: config.url || '',
            method: config.method || '',
            params: JSON.stringify(config.params || {}),
            cancel: () => controller.abort(),
          });
        }

        // 添加 Token
        const token = this.tokenManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 显示加载状态
        if (requestConfig.showLoading !== false) {
          message.loading('请求处理中...', 0);
        }

        return config;
      },
      (error: AxiosError) => {
        message.destroy();
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 移除请求记录
        const requestKey = this.generateRequestKey(response.config);
        this.pendingRequests.delete(requestKey);

        // 隐藏加载状态
        message.destroy();

        return response;
      },
      async (error: AxiosError) => {
        // 移除请求记录
        if (error.config) {
          const requestKey = this.generateRequestKey(error.config);
          this.pendingRequests.delete(requestKey);
        }

        // 隐藏加载状态
        message.destroy();

        // 处理 401 未授权错误
        if (error.response?.status === 401) {
          return this.handleUnauthorized(error);
        }

        // 显示错误消息
        const config = error.config as RequestConfig;
        if (config?.showErrorMessage !== false) {
          const errorMessage = this.getErrorMessage(error);
          message.error(errorMessage);
        }

        return Promise.reject(error);
      },
    );
  }

  // 生成请求唯一标识
  private generateRequestKey(config: AxiosRequestConfig): string {
    const { url, method, params, data } = config;
    return `${method?.toUpperCase()}_${url}_${JSON.stringify(params)}_${JSON.stringify(data)}`;
  }

  // 处理未授权错误
  private async handleUnauthorized(error: AxiosError): Promise<any> {
    const originalConfig = error.config as RequestConfig;

    if (!this.isRefreshing) {
      this.isRefreshing = true;

      try {
        const newToken = await this.tokenManager.refreshToken();
        this.tokenManager.setToken(newToken);

        // 处理等待队列
        this.failedQueue.forEach(({ resolve }) => resolve(newToken));
        this.failedQueue = [];

        this.isRefreshing = false;

        // 重新发送原始请求
        if (originalConfig) {
          originalConfig.headers = originalConfig.headers || {};
          originalConfig.headers.Authorization = `Bearer ${newToken}`;
          return this.axiosInstance.request(originalConfig);
        }
      } catch (refreshError) {
        // 刷新 token 失败，清除 token 并跳转到登录页
        this.tokenManager.clearToken();
        this.failedQueue.forEach(({ reject }) => reject(refreshError));
        this.failedQueue = [];
        this.isRefreshing = false;

        // 可以在这里处理跳转到登录页的逻辑
        // window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    // 如果正在刷新 token，将请求加入等待队列
    return new Promise((resolve, reject) => {
      this.failedQueue.push({
        resolve: (token: string) => {
          if (originalConfig) {
            originalConfig.headers = originalConfig.headers || {};
            originalConfig.headers.Authorization = `Bearer ${token}`;
            resolve(this.axiosInstance.request(originalConfig));
          }
        },
        reject: (error: any) => reject(error),
      });
    });
  }

  // 获取错误消息
  private getErrorMessage(error: AxiosError): string {
    if (error.response) {
      const { status, data } = error.response;

      // 根据状态码返回不同的错误消息
      switch (status) {
        case 400:
          return (data as any)?.message || '请求参数错误';
        case 401:
          return '未授权，请重新登录';
        case 403:
          return '权限不足';
        case 404:
          return '请求的资源不存在';
        case 500:
          return '服务器内部错误';
        default:
          return (data as any)?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      return '网络连接失败，请检查网络设置';
    } else {
      return error.message || '请求发生未知错误';
    }
  }
}

// 创建默认实例
const httpClient = new AxiosMiddleware(process.env.REACT_APP_API_BASE_URL || '');

// 导出默认实例和类
export default httpClient;
export { AxiosMiddleware };

// 使用示例：
/*
// 1. 基本使用
import httpClient from './axios-middleware';

// GET 请求
const getUserData = async (userId: string) => {
  try {
    const response = await httpClient.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取用户数据失败:', error);
  }
};

// POST 请求
const createUser = async (userData: any) => {
  try {
    const response = await httpClient.post('/api/users', userData, {
      showLoading: true,
      showErrorMessage: true,
    });
    return response.data;
  } catch (error) {
    console.error('创建用户失败:', error);
  }
};

// 2. 自定义 Token 管理器
const customTokenManager = {
  getToken: () => sessionStorage.getItem('token'),
  setToken: (token: string) => sessionStorage.setItem('token', token),
  clearToken: () => sessionStorage.removeItem('token'),
  refreshToken: async () => {
    // 自定义刷新逻辑
    const response = await fetch('/api/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });
    const data = await response.json();
    return data.token;
  },
};

const customHttpClient = new AxiosMiddleware('https://api.example.com', customTokenManager);

// 3. 跳过重复请求检查
const getDataWithoutDuplicateCheck = async () => {
  const response = await httpClient.get('/api/data', {
    skipDuplicateCheck: true,
  });
  return response.data;
};
*/
