// API Configuration helper for dual-tier or single-tier deployment
// In local dev and full Render deployments, VITE_SERVER_URL is empty, so relative paths and origin are used.
// If frontend is hosted on GitHub Pages and backend on Render, set VITE_SERVER_URL to backend URL.

export const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

export function apiUrl(path) {
  if (!SERVER_URL) return path;
  const base = SERVER_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function getSocketUrl() {
  return SERVER_URL || window.location.origin;
}
