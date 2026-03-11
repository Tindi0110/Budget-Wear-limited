// Normalize URL to never end with a slash
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('API Error Response:', error);
    throw new Error(error.message || error.detail || `API request failed with status ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  async fetchWithRetry(endpoint: string, options: RequestInit) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      return await handleResponse(response);
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network Error at:', `${API_BASE_URL}${endpoint}`);
        throw new Error(`Connection refused to ${API_BASE_URL}. Ensure backend is running.`);
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
