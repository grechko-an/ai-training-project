/**
 * Base API Client class
 * Provides common methods and utilities for all API clients
 * Handles authentication, request/response logging, and error handling
 */

import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../../types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface ApiRequestOptions {
  /** Request headers */
  headers?: Record<string, string>;
  /** Query parameters */
  params?: Record<string, string | number | boolean | undefined>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Base URL override */
  baseURL?: string;
  /** Authentication token */
  token?: string;
  /** Response type */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

export class BaseApiClient {
  protected readonly baseURL: string;
  protected readonly apiVersion: string;
  protected readonly defaultTimeout: number;
  protected authToken: string = '';
  protected readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string, apiVersion: string = 'v1', timeout: number = 30000) {
    this.baseURL = baseURL;
    this.apiVersion = apiVersion;
    this.defaultTimeout = timeout;

    this.axiosInstance = axios.create({
      baseURL: `${this.baseURL}/${this.apiVersion}`,
      timeout: this.defaultTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API Request Error]', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          console.error(`[API Error] ${error.response.status} ${error.config?.url}`, error.response.data);
        } else {
          console.error('[API Error]', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // ===========================================
  // Authentication Methods
  // ===========================================

  /**
   * Set the authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear the authentication token
   */
  clearAuthToken(): void {
    this.authToken = '';
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  // ===========================================
  // HTTP Methods
  // ===========================================

  /**
   * Send a GET request
   */
  async get<T = unknown>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * Send a POST request
   */
  async post<T = unknown>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, options);
  }

  /**
   * Send a PUT request
   */
  async put<T = unknown>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  /**
   * Send a PATCH request
   */
  async patch<T = unknown>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  /**
   * Send a DELETE request
   */
  async delete<T = unknown>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  // ===========================================
  // Core Request Method
  // ===========================================

  /**
   * Core request method that handles all HTTP methods
   */
  private async request<T = unknown>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        method: method as string,
        url: endpoint,
        data: data,
        headers: {
          ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
          ...options?.headers,
        },
        params: options?.params,
        timeout: options?.timeout || this.defaultTimeout,
        baseURL: options?.baseURL || `${this.baseURL}/${this.apiVersion}`,
        responseType: options?.responseType || 'json',
      };

      const response: AxiosResponse<T> = await this.axiosInstance.request(config);

      return {
        status: response.status,
        data: response.data,
        headers: response.headers as Record<string, string>,
        response: response as unknown as APIResponse,
      };
    } catch (error: any) {
      if (error.response) {
        const apiError: ApiError = {
          status: error.response.status,
          message: error.response.data?.message || error.message,
          code: error.response.data?.code || 'UNKNOWN_ERROR',
          details: error.response.data?.details,
        };
        throw apiError;
      }
      throw {
        status: 0,
        message: error.message || 'Network error',
        code: 'NETWORK_ERROR',
      } as ApiError;
    }
  }

  // ===========================================
  // Playwright API Request Context Methods
  // ===========================================

  /**
   * Send a request using Playwright's APIRequestContext
   * Useful when you need to integrate with Playwright's test context
   */
  async playwrightRequest(
    request: APIRequestContext,
    method: HttpMethod,
    endpoint: string,
    options?: {
      data?: unknown;
      headers?: Record<string, string>;
      params?: Record<string, string | number | boolean>;
      timeout?: number;
    }
  ): Promise<APIResponse> {
    const url = `${this.baseURL}/${this.apiVersion}${endpoint}`;
    const requestOptions: Record<string, unknown> = {
      headers: {
        ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
        ...options?.headers,
      },
      params: options?.params,
      timeout: options?.timeout || this.defaultTimeout,
    };

    if (options?.data) {
      requestOptions.data = options.data;
    }

    switch (method) {
      case 'GET':
        return request.get(url, requestOptions);
      case 'POST':
        return request.post(url, requestOptions);
      case 'PUT':
        return request.put(url, requestOptions);
      case 'PATCH':
        return request.patch(url, requestOptions);
      case 'DELETE':
        return request.delete(url, requestOptions);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  // ===========================================
  // Response Validation Methods
  // ===========================================

  /**
   * Assert that the response status matches expected
   */
  assertStatus(response: ApiResponse, expectedStatus: number): void {
    expect(response.status).toBe(expectedStatus);
  }

  /**
   * Assert that the response has a specific property
   */
  assertResponseHasProperty(response: ApiResponse, property: string): void {
    expect(response.data).toHaveProperty(property);
  }

  /**
   * Assert that the response data matches expected structure
   */
  assertResponseStructure(response: ApiResponse, expectedKeys: string[]): void {
    for (const key of expectedKeys) {
      expect(response.data).toHaveProperty(key);
    }
  }

  /**
   * Get the full API URL for an endpoint
   */
  getFullUrl(endpoint: string): string {
    return `${this.baseURL}/${this.apiVersion}${endpoint}`;
  }
}