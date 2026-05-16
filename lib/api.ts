// ─── RepRight API Client ────────────────────────────────────────────────────
// Centralized fetch wrapper with JWT auth, auto-refresh, and error handling.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── Token Management ───────────────────────────────────────────────────────
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('repright_access_token');
}

export function setAccessToken(token: string): void {
  localStorage.setItem('repright_access_token', token);
}

export function clearAuth(): void {
  localStorage.removeItem('repright_access_token');
  localStorage.removeItem('repright_user');
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('repright_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setStoredUser(user: any): void {
  localStorage.setItem('repright_user', JSON.stringify(user));
}

// ─── Core Fetch Wrapper ─────────────────────────────────────────────────────
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Send cookies for refresh token
  });

  // If 401 and we had a token, try refreshing
  if (response.status === 401 && token) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      // Retry original request with new token
      const newToken = getAccessToken();
      headers['Authorization'] = `Bearer ${newToken}`;
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });
    } else {
      // Refresh failed — clear auth and redirect
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  }

  return response;
}

async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ─── API Helper Methods ─────────────────────────────────────────────────────
export const api = {
  get: async (endpoint: string) => {
    const res = await fetchWithAuth(endpoint);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || `Request failed with status ${res.status}`);
    }
    return res.json();
  },

  post: async (endpoint: string, data?: any) => {
    const res = await fetchWithAuth(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || `Request failed with status ${res.status}`);
    }
    return res.json();
  },

  put: async (endpoint: string, data?: any) => {
    const res = await fetchWithAuth(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || `Request failed with status ${res.status}`);
    }
    return res.json();
  },

  delete: async (endpoint: string) => {
    const res = await fetchWithAuth(endpoint, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || `Request failed with status ${res.status}`);
    }
    return res.json();
  },
};

// ─── Auth-Specific Methods ──────────────────────────────────────────────────
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  setAccessToken(data.accessToken);
  setStoredUser(data.user);

  return data;
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
  fitnessLevel: string = 'beginner'
) {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, fitnessLevel }),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  setAccessToken(data.accessToken);
  setStoredUser(data.user);

  return data;
}

export async function logoutUser() {
  try {
    await fetchWithAuth('/api/auth/logout', { method: 'POST' });
  } catch {
    // Proceed with local cleanup even if server call fails
  }
  clearAuth();
}

export async function getCurrentUser() {
  return api.get('/api/auth/me');
}
