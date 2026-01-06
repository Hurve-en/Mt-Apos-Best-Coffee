import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest, Product, Order, OrderRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Product endpoints
  async getProducts() {
    const response = await this.api.get<{ products: Product[] }>('/products');
    return response.data.products || [];
  }

  async getProductById(id: string) {
    const response = await this.api.get<{ product: Product }>(`/products/${id}`);
    return response.data.product;
  }

  async getProductsByCategory(category: string) {
    const response = await this.api.get<{ products: Product[] }>(`/products/category/${category}`);
    return response.data.products || [];
  }

  // User endpoints
  async getProfile() {
    const response = await this.api.get('/users/profile');
    return response.data.user;
  }

  async updateProfile(data: any) {
    const response = await this.api.put('/users/profile', data);
    return response.data.user;
  }

  // Order endpoints
  async createOrder(data: OrderRequest) {
    const response = await this.api.post<{ order: Order }>('/orders', data);
    return response.data.order;
  }

  async getOrders() {
    const response = await this.api.get<{ orders: Order[] }>('/orders/my-orders');
    return response.data.orders || [];
  }

  async getOrderById(id: string) {
    const response = await this.api.get<{ order: Order }>(`/orders/${id}`);
    return response.data.order;
  }

  async cancelOrder(id: string) {
    const response = await this.api.patch<{ order: Order }>(`/orders/${id}/cancel`, {});
    return response.data.order;
  }
}

export const apiService = new ApiService();