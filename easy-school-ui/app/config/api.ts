// Custom Error class to preserve HTTP status
class HttpError extends Error {
  public status: number;
  public response: Response;

  constructor(response: Response, message?: string) {
    super(message || `HTTP ${response.status}: ${response.statusText}`);
    this.name = 'HttpError';
    this.status = response.status;
    this.response = response;
  }
}

// Approach 1: Resource-specific API client
interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
}

export class ApiClient {
  private config: ApiConfig;

  constructor(config?: Partial<ApiConfig>) {
    this.config = {
      baseURL: config?.baseURL!,
      timeout: parseInt(process.env.API_TIMEOUT || '5000'),
      retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),
    };
  }


  setBaseURL(url: string) {
    this.config.baseURL = url;
  }
  getBaseURL() {
    return this.config.baseURL;
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

      // FIXED: Throw HttpError with status information preserved
      if (!response.ok) {
        throw new HttpError(response);
      }

      // Conditionally parse response based on Content-Type header
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json() as Promise<T>;
      } else {
        // If content-type is not JSON, or not present, assume text
        return response.text() as Promise<T>;
      }

    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        // FIXED: If it's already an HttpError, re-throw it as-is
        if (error instanceof HttpError) {
          throw error;
        }
        throw new Error(`API request failed: ${error.message}`);
      }
      throw error;
    }
  }

  // Create resource-specific client
  resource(basePath: string) {
    return new ResourceClient(this, basePath);
  }

  get<T>(endpoint: string, init?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...(init || {}) });
  }

  post<T>(endpoint: string, data: any, init?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...(init || {}),
    });
  }

  put<T>(endpoint: string, data: any, init?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...(init || {}),
    });
  }

  delete<T>(endpoint: string, init?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...(init || {}) });
  }
}

// Resource-specific client
class ResourceClient {
  constructor(private apiClient: ApiClient, private basePath: string) { }

  private buildEndpoint(endpoint: string = ''): string {
    if (!endpoint) return this.basePath;
    if (endpoint.startsWith('?')) return `${this.basePath}${endpoint}`;
    const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.basePath}${clean}`;
  }

  get<T>(endpoint: string = '', init?: RequestInit): Promise<T> {
    return this.apiClient.get<T>(this.buildEndpoint(endpoint), init);
  }

  post<T>(data?: any, init?: RequestInit): Promise<T>;
  post<T>(endpoint: string, data?: any, init?: RequestInit): Promise<T>;
  post<T>(endpointOrData?: string | any, data?: any, init?: RequestInit): Promise<T> {
    if (typeof endpointOrData !== 'string') {
      return this.apiClient.post<T>(this.buildEndpoint(''), endpointOrData, data as RequestInit); // data here is actually init
    }
    return this.apiClient.post<T>(this.buildEndpoint(endpointOrData), data, init);
  }

  put<T>(data?: any, init?: RequestInit): Promise<T>;
  put<T>(endpoint: string, data?: any, init?: RequestInit): Promise<T>;
  put<T>(endpointOrData?: string | any, data?: any, init?: RequestInit): Promise<T> {
    if (typeof endpointOrData !== 'string') {
      return this.apiClient.put<T>(this.buildEndpoint(''), endpointOrData, data as any);
    }
    return this.apiClient.put<T>(this.buildEndpoint(endpointOrData), data, init);
  }

  delete<T>(endpoint: string = '', init?: RequestInit): Promise<T> {
    return this.apiClient.delete<T>(this.buildEndpoint(endpoint), init);
  }
}

export const apiClient = new ApiClient();
export { HttpError };