const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3000';

let _cache = null; // array of normalized places
let _byId = new Map();

function normalizePlace(p) {
    if (!p) return null;

    let lat, lng;
    if (Array.isArray(p.location) && p.location.length >= 2) {
        // [lng, lat]
        const [LNG, LAT] = p.location;
        lat = Number(LAT);
        lng = Number(LNG);
    } else if (p.location && Array.isArray(p.location.coordinates) && p.location.coordinates.length >= 2) {
        const [LNG, LAT] = p.location.coordinates; // GeoJSON
        lat = Number(LAT);
        lng = Number(LNG);
    } else if (typeof p.lat === 'number' && typeof p.lng === 'number') {
        lat = p.lat; lng = p.lng;
    } else if (typeof p.latitude === 'number' && typeof p.longitude === 'number') {
        lat = p.latitude; lng = p.longitude;
    } else if (Array.isArray(p.source) && p.source.length === 2) {
        // already in [lat, lng]
        const [LAT, LNG] = p.source;
        lat = Number(LAT);
        lng = Number(LNG);
    }

    const source = (typeof lat === 'number' && !Number.isNaN(lat) && typeof lng === 'number' && !Number.isNaN(lng))
        ? [lat, lng]
        : null; // app uses [lat, lng]

    return {
        id: p._id || p.id,
        name: p.name || 'Unknown',
        source,
        image: p.imageUrl || p.image || (p.photos && p.photos[0]) || undefined,
        description: p.description || '',
        category: p.type || (Array.isArray(p.tags) ? p.tags[0] : undefined),
        tags: p.tags || [],
        raw: p,
    };
}

function getToken() {
    // Read jwtToken from cookies (prefer HttpOnly cookie flow; header added only if readable and valid)
    if (typeof document === "undefined" || !document.cookie) return null;
    const match = document.cookie.match(/(?:^|;\s*)jwtToken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export async function fetchPlacesAll(type = '') {
    const url = new URL(`/places/all?type=`, BASE_URL);

    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token && token !== 'jwtToken' && token.split('.').length === 3) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url.toString(), { method: 'GET', headers });

    const raw = await res.text();
    let data; try { data = raw ? JSON.parse(raw) : []; } catch { data = []; }
    console.log(data);
  
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
    // Ensure we have a list to search (prefer cache, fallback to fetch)
    const items = _cache && Array.isArray(_cache) ? _cache : await fetchPlacesAll(type);
    const q = (query || '').trim().toLowerCase();
    if (!q) return items;
    return items.filter(p => (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (Array.isArray(p.tags) && p.tags.join(' ').toLowerCase().includes(q))
    ));
}

export function getPlaceById(id) {
    return _byId.get(id);
}
