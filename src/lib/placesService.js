const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

let _cache = null; // array of normalized places
let _byId = new Map();

function normalizePlace(p) {
  if (!p) return null;
  const [lng, lat] = Array.isArray(p.location) ? p.location : [undefined, undefined];
  const source = typeof lat === 'number' && typeof lng === 'number' ? [lat, lng] : null; // app uses [lat, lng]
  return {
    id: p._id || p.id,
    name: p.name || 'Unknown',
    source,
    image: p.imageUrl || p.image || undefined,
    description: p.description || '',
    category: p.type || (Array.isArray(p.tags) ? p.tags[0] : undefined),
    tags: p.tags || [],
    raw: p,
  };
}

export async function fetchPlacesAll(type = '') {
  const url = new URL('/places/all', BASE_URL);
  if (type) url.searchParams.set('type', type);
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken") || "jwtToken";
    if (token && token !== 'jwtToken' && token.split('.').length === 3) {
        headers.Authorization = `Bearer ${token}`;
    }
  const res = await fetch(url.toString(), { method: 'GET', headers });
  const raw = await res.text();
  let data; try { data = raw ? JSON.parse(raw) : []; } catch { data = []; }
  if (!res.ok) throw new Error(data?.message || 'Failed to fetch places');
  const normalized = (Array.isArray(data) ? data : [])
    .map(normalizePlace)
    .filter((p) => p && p.id); // require valid id
  // de-duplicate by id
  const seen = new Set();
  const dedup = [];
  for (const p of normalized) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    dedup.push(p);
  }
  _cache = dedup;
  _byId = new Map(dedup.map(p => [p.id, p]));
  return dedup;
}

export async function getAllPlacesCached(type = '') {
  if (_cache) return _cache;
  return fetchPlacesAll(type);
}

export async function searchPlaces(query = '', type = '') {
  const items = await getAllPlacesCached(type);
  const q = (query || '').toLowerCase();
  if (!q) return items;
  return items.filter(p => (
    p.name?.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q) ||
    (Array.isArray(p.tags) && p.tags.join(' ').toLowerCase().includes(q))
  ));
}

export function getPlaceById(id) {
  return _byId.get(id);
}
