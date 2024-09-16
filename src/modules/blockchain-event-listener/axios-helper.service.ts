// axios-helper.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { GAME_ENDPOINT } from 'src/constants/game.endpoint';

@Injectable()
export class AxiosHelperService {

  private readonly axiosInstance: AxiosInstance;

  constructor() {
    // Create the Axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: 'https://api.example.com', // You can set your default API base URL here
      timeout: 5000, // Set a timeout for the requests
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Set up Axios interceptors (optional)
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // You can add custom logic here (e.g., adding authentication tokens)
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // You can handle global error handling logic here
        return Promise.reject(error);
      },
    );
  }

  // Generic GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Generic POST request
  async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Generic PUT request
  async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Generic DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }






  // Centralized error handling
  private handleError(error: any): void {
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new HttpException(
        error.response.data || 'Something went wrong',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new HttpException(
        'No response received from the server',
        HttpStatus.REQUEST_TIMEOUT,
      );
    } else {
      // Something happened while setting up the request
      throw new HttpException(
        error.message || 'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



}