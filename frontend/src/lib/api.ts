// Normalize URL to never end with a slash
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;

async function handleResponse(response: Response, endpoint: string) {
  if (!response.ok) {
    let errorDetail = '';
    try {
      const error = await response.json();
      if (typeof error === 'object' && error !== null) {
        // Flatten DRF error dictionaries (e.g., { "name": ["This field is required."] })
        errorDetail = Object.entries(error)
          .map(([key, value]) => {
            const val = Array.isArray(value) ? value.join(' ') : value;
            return key === 'detail' || key === 'non_field_errors' || key === 'message' 
              ? `${val}` 
              : `${key}: ${val}`;
          })
          .join(' | ');
      } else {
        errorDetail = error.message || error.detail || JSON.stringify(error);
      }
    } catch (e) {
      errorDetail = `Status ${response.status}: ${response.statusText}`;
    }
    console.error(`API Error [${endpoint}]:`, errorDetail);
    throw new Error(errorDetail);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  async fetchWithRetry(endpoint: string, options: RequestInit) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API Request] ${options.method || 'GET'} ${url}`);
    try {
      const response = await fetch(url, options);
      return await handleResponse(response, endpoint);
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('[API Network Error]:', url);
        throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Ensure it is running and accessible via HTTPS.`);
      }
      throw error;
    }
  },

  async get(endpoint: string) {
    return this.fetchWithRetry(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 0 }
    });
  },

  async post(endpoint: string, data: any) {
    return this.fetchWithRetry(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async put(endpoint: string, data: any) {
    return this.fetchWithRetry(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async patch(endpoint: string, data: any) {
    return this.fetchWithRetry(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async delete(endpoint: string) {
    return this.fetchWithRetry(endpoint, {
      method: 'DELETE',
    });
  }
};
