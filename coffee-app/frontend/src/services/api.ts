import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Product,
  Order,
  OrderRequest,
} from "../types";

const PRIMARY_API_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3000/api";
const FALLBACK_API_URL = "http://localhost:5000/api";

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = PRIMARY_API_URL;
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  private async requestWithFallback<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.request<T>(config);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const shouldFallback =
        !axiosError.response && this.baseURL !== FALLBACK_API_URL;

      if (!shouldFallback) {
        throw error;
      }

      this.baseURL = FALLBACK_API_URL;
      this.api.defaults.baseURL = FALLBACK_API_URL;

      const fallbackResponse = await this.api.request<T>(config);
      return fallbackResponse.data;
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.requestWithFallback<AuthResponse>({
      method: "post",
      url: "/auth/login",
      data,
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.requestWithFallback<AuthResponse>({
      method: "post",
      url: "/auth/register",
      data,
    });
  }

  async getCurrentUser() {
    return this.requestWithFallback({
      method: "get",
      url: "/auth/me",
    });
  }

  async getProducts() {
    const data = await this.requestWithFallback<any>({
      method: "get",
      url: "/products",
    });
    return (data.data || data.products || []) as Product[];
  }

  async getProductById(id: string) {
    const data = await this.requestWithFallback<any>({
      method: "get",
      url: `/products/${id}`,
    });
    return (data.data || data.product) as Product;
  }

  async getProductsByCategory(category: string) {
    const data = await this.requestWithFallback<any>({
      method: "get",
      url: `/products/category/${category}`,
    });
    return (data.data || data.products || []) as Product[];
  }

  async getProfile() {
    const data = await this.requestWithFallback<any>({
      method: "get",
      url: "/users/profile",
    });
    return data.user;
  }

  async updateProfile(data: any) {
    const response = await this.requestWithFallback<any>({
      method: "put",
      url: "/users/profile",
      data,
    });
    return response.user;
  }

  async createOrder(data: OrderRequest) {
    const response = await this.requestWithFallback<any>({
      method: "post",
      url: "/orders",
      data,
    });
    return response.order;
  }

  async getOrders() {
    const response = await this.requestWithFallback<any>({
      method: "get",
      url: "/orders/my-orders",
    });
    return (response.orders || response.data || []) as Order[];
  }

  async getOrderById(id: string) {
    const response = await this.requestWithFallback<any>({
      method: "get",
      url: `/orders/${id}`,
    });
    return (response.order || response.data) as Order;
  }

  async cancelOrder(id: string) {
    const response = await this.requestWithFallback<any>({
      method: "patch",
      url: `/orders/${id}/cancel`,
      data: {},
    });
    return response.order as Order;
  }
}

export const apiService = new ApiService();
