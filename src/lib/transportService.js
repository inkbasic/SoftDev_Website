const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3000';

function getToken() {
  if (typeof document === 'undefined' || !document.cookie) return null;
  const match = document.cookie.match(/(?:^|;\s*)jwtToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function normalizeTransportMethod(raw) {
  if (!raw) return null;
  const d = raw.data || raw; // support {message,status,data}
  const id = d._id || d.id;
  return {
    id,
    _id: d._id,
    name: d.name,
    description: d.description,
    imageUrl: d.imageUrl,
    contactInfo: d.contactInfo, // URL
    hasBooking: !!d.hasBooking,
    providerId: d.providerId || id,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export async function getTransportMethodById(id, signal) {
  if (!id) return null;
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token && token !== 'jwtToken' && token.split('.').length === 3) {
    headers.Authorization = `Bearer ${token}`;
  }
  const url = `${BASE_URL}/transport-method/${encodeURIComponent(id)}`;
  const res = await fetch(url, { method: 'GET', headers, signal });
  const raw = await res.text();
  let body; try { body = raw ? JSON.parse(raw) : null; } catch { body = raw; }
  if (!res.ok) {
    const msg = (body && body.message) || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return normalizeTransportMethod(body);
}

export async function getDefaultTransportMethods(signal) {
  // Fetch the two known rental providers in parallel
  const IDS = ['6904d79b2d713cc72d82b780', '6904db7b16b53151736b6619'];
  const tasks = IDS.map((id) => getTransportMethodById(id, signal).catch(() => null));
  const results = await Promise.all(tasks);
  return results.filter(Boolean);
}
