import { Keys } from '@/lib/keys';
import { Routes } from '@/lib/routes';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export const JEW000 = '/jewelry/update-store-data';
export const JEW001 = '/jewelry/get-store-data';
export const AUT000 = '/auth/login';
export const AUT001 = '/auth/change-password';
export const AUT00 = '/auth/check-token';

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem(Keys.accessToken);
          window.location.replace(Routes.login);
        }
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem(Keys.accessToken);
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public async get<T>(url: string, params?: any): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.get<T>(url, { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<T>;
      return axiosError.response?.data;
    }
  }

  public async post<T>(url: string, data: any): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.post<T>(url, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<T>;
      return axiosError.response?.data;
    }
  }

  public async postForm<T>(url: string, data: any): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.postForm<T>(url, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<T>;
      return axiosError.response?.data;
    }
  }
}

export default ApiClient.getInstance();
