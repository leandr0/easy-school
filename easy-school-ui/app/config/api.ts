// Approach 1: Resource-specific API client
interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
}

class ApiClient {
  private config: ApiConfig;

  constructor() {
    this.config = {
      baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
      timeout: parseInt(process.env.API_TIMEOUT || '5000'),
      retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw new Error(`API request failed: ${error.message}`);
      }
      throw error;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // NEW: Create resource-specific client
  resource(basePath: string) {
    return new ResourceClient(this, basePath);
  }
}

// Resource-specific client that prefixes all endpoints
class ResourceClient {
  constructor(
    private apiClient: ApiClient,
    private basePath: string
  ) {}

  private buildEndpoint(endpoint: string = ''): string {
    // If endpoint is empty, just return basePath
    if (!endpoint) {
      return this.basePath;
    }
    
    // If endpoint starts with '?', it's a query string - append directly
    if (endpoint.startsWith('?')) {
      return `${this.basePath}${endpoint}`;
    }
    
    // Otherwise, ensure it starts with '/' for path segments
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.basePath}${cleanEndpoint}`;
  }

  get<T>(endpoint: string = ''): Promise<T> {
    return this.apiClient.get<T>(this.buildEndpoint(endpoint));
  }

  post<T>(data?: any): Promise<T>;
  post<T>(endpoint: string, data?: any): Promise<T>;
  post<T>(endpointOrData?: string | any, data?: any): Promise<T> {
    // If first argument is not a string, it's the data
    if (typeof endpointOrData !== 'string') {
      return this.apiClient.post<T>(this.buildEndpoint(''), endpointOrData);
    }
    // Otherwise, first argument is endpoint, second is data
    return this.apiClient.post<T>(this.buildEndpoint(endpointOrData), data);
  }

  put<T>(data?: any): Promise<T>;
  put<T>(endpoint: string, data?: any): Promise<T>;
  put<T>(endpointOrData?: string | any, data?: any): Promise<T> {
    // If first argument is not a string, it's the data
    if (typeof endpointOrData !== 'string') {
      return this.apiClient.put<T>(this.buildEndpoint(''), endpointOrData);
    }
    // Otherwise, first argument is endpoint, second is data
    return this.apiClient.put<T>(this.buildEndpoint(endpointOrData), data);
  }

  delete<T>(endpoint: string = ''): Promise<T> {
    return this.apiClient.delete<T>(this.buildEndpoint(endpoint));
  }
}

export const apiClient = new ApiClient();