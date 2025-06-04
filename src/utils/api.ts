
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface LoginCredentials {
  username: string;
  password: string;
  role: 'admin' | 'kitchen' | 'rider';
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async verifyToken(): Promise<{ valid: boolean; user?: User }> {
    return this.request<{ valid: boolean; user?: User }>('/api/auth/verify');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Promise<{ success: boolean; user?: User }> {
    return this.request<{ success: boolean; user?: User }>('/api/auth/create-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async checkHealth(): Promise<{ status: string; database: string; timestamp: string }> {
    return this.request<{ status: string; database: string; timestamp: string }>('/api/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
