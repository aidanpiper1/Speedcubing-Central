import axios, { type AxiosError } from 'axios';

// Axios instance. Cookies carry the JWTs (httpOnly), so withCredentials is on.
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let refreshing: Promise<void> | null = null;

async function doRefresh(): Promise<void> {
  if (!refreshing) {
    refreshing = api
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

// Response interceptor: on a 401, try one refresh then replay the request.
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/register');

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        await doRefresh();
        return api(original);
      } catch {
        // fall through to reject
      }
    }
    return Promise.reject(error);
  },
);

export function apiError(e: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(e)) {
    return (e.response?.data as { error?: string })?.error ?? e.message ?? fallback;
  }
  return fallback;
}
