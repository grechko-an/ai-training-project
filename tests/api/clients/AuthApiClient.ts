/**
 * Authentication API Client
 * Provides methods for authentication-related API endpoints
 * Follows the API client pattern for test maintainability
 */

import { BaseApiClient, ApiRequestOptions } from './BaseApiClient';
import { ApiResponse, AuthTokenResponse, UserProfile } from '../../types';

export class AuthApiClient extends BaseApiClient {
  /**
   * Login with username and password
   * POST /auth/login
   */
  async login(username: string, password: string, options?: ApiRequestOptions): Promise<ApiResponse<AuthTokenResponse>> {
    const response = await this.post<AuthTokenResponse>('/auth/login', {
      username,
      password,
    }, options);

    // If login is successful, store the token
    if (response.status === 200 && response.data.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  /**
   * Register a new user
   * POST /auth/register
   */
  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }, options?: ApiRequestOptions): Promise<ApiResponse<UserProfile & { token: string }>> {
    return this.post<UserProfile & { token: string }>('/auth/register', userData, options);
  }

  /**
   * Logout the current user
   * POST /auth/logout
   */
  async logout(options?: ApiRequestOptions): Promise<ApiResponse<{ message: string }>> {
    const response = await this.post<{ message: string }>('/auth/logout', {}, options);
    this.clearAuthToken();
    return response;
  }

  /**
   * Refresh the authentication token
   * POST /auth/refresh
   */
  async refreshToken(refreshToken: string, options?: ApiRequestOptions): Promise<ApiResponse<AuthTokenResponse>> {
    return this.post<AuthTokenResponse>('/auth/refresh', {
      refreshToken,
    }, options);
  }

  /**
   * Get the current user's profile
   * GET /auth/me
   */
  async getCurrentUser(options?: ApiRequestOptions): Promise<ApiResponse<UserProfile>> {
    return this.get<UserProfile>('/auth/me', options);
  }

  /**
   * Update the current user's profile
   * PUT /auth/me
   */
  async updateCurrentUser(updateData: Partial<{
    firstName: string;
    lastName: string;
    email: string;
  }>, options?: ApiRequestOptions): Promise<ApiResponse<UserProfile>> {
    return this.put<UserProfile>('/auth/me', updateData, options);
  }

  /**
   * Change the current user's password
   * POST /auth/change-password
   */
  async changePassword(currentPassword: string, newPassword: string, options?: ApiRequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    }, options);
  }

  /**
   * Request a password reset
   * POST /auth/forgot-password
   */
  async forgotPassword(email: string, options?: ApiRequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/auth/forgot-password', {
      email,
    }, options);
  }

  /**
   * Reset password with a reset token
   * POST /auth/reset-password
   */
  async resetPassword(resetToken: string, newPassword: string, options?: ApiRequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/auth/reset-password', {
      resetToken,
      newPassword,
    }, options);
  }

  /**
   * Verify email address
   * POST /auth/verify-email
   */
  async verifyEmail(verificationToken: string, options?: ApiRequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/auth/verify-email', {
      verificationToken,
    }, options);
  }

  /**
   * Check if a username is available
   * GET /auth/check-username
   */
  async checkUsername(username: string, options?: ApiRequestOptions): Promise<ApiResponse<{ available: boolean }>> {
    return this.get<{ available: boolean }>('/auth/check-username', {
      ...options,
      params: { username },
    });
  }

  /**
   * Check if an email is available
   * GET /auth/check-email
   */
  async checkEmail(email: string, options?: ApiRequestOptions): Promise<ApiResponse<{ available: boolean }>> {
    return this.get<{ available: boolean }>('/auth/check-email', {
      ...options,
      params: { email },
    });
  }

  /**
   * Get all users (admin only)
   * GET /auth/users
   */
  async getUsers(options?: ApiRequestOptions): Promise<ApiResponse<UserProfile[]>> {
    return this.get<UserProfile[]>('/auth/users', options);
  }

  /**
   * Delete a user (admin only)
   * DELETE /auth/users/:id
   */
  async deleteUser(userId: string, options?: ApiRequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/auth/users/${userId}`, options);
  }
}