// Admin panel URL prefix. Set VITE_ADMIN_PATH in .env (must match ADMIN_PATH in the backend .env).
const raw = (import.meta.env.VITE_ADMIN_PATH || "admin").replace(/^\/+|\/+$/g, "");

export const ADMIN_BASE = `/${raw}`;

export const adminUrl = (sub = "") => `${ADMIN_BASE}${sub}`;
