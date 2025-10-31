const cache = new Map();

// Normalize any 2-number pair into [lat, lng]. Accepts [lat,lng] or [lng,lat] and infers by value ranges.
const toLatLng = (pair) => {
    if (!Array.isArray(pair) || pair.length !== 2) return null;
    const a = Number(pair[0]);
    const b = Number(pair[1]);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    const aIsLat = Math.abs(a) <= 90;
    const bIsLat = Math.abs(b) <= 90;
    // first looks like lng (<=180) and second like lat (<=90) -> [lng,lat] => swap
    if (!aIsLat && bIsLat) return [b, a];
    // first looks like lat (<=90) and second like lng (<=180) -> already [lat,lng]
    if (aIsLat && !bIsLat) return [a, b];
    // ambiguous: assume [lat,lng]
    return [a, b];
};

// Extract coordinates from various shapes; always return [lat, lng]
const getCoords = (loc) => {
    if (!loc) return null;
    if (Array.isArray(loc.source) && loc.source.length === 2) {
        const v = toLatLng(loc.source);
        if (v) return v;
    }
    if (Array.isArray(loc.position) && loc.position.length === 2) {
        const v = toLatLng(loc.position);
        if (v) return v;
    }
    if (Array.isArray(loc?.raw?.location) && loc.raw.location.length === 2) {
        const v = toLatLng(loc.raw.location);
        if (v) return v;
    }
    if (typeof loc.latitude === "number" && typeof loc.longitude === "number") {
        return [loc.latitude, loc.longitude];
    }
    return null;
};

export async function getTravelBetween(a, b, signal) {
    const A = getCoords(a);
    const B = getCoords(b);
    if (!A || !B) return null;

    const [lat1, lng1] = A;
    const [lat2, lng2] = B;

    const key = `${lng1},${lat1}|${lng2},${lat2}`;
    if (cache.has(key)) return cache.get(key);

    // ขอ geometry แบบ GeoJSON เพื่อวาดเส้นได้เลย
    const url = `https://osrm.wannago.code4.dad/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson&alternatives=false&steps=false`;
    const res = await fetch(url, { signal });
    if (!res.ok) return null;

    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) return null;

    // GeoJSON coordinates เป็น [lng, lat] → แปลงเป็น [lat, lng]
    const coords = Array.isArray(route.geometry?.coordinates)
        ? route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
        : [];

    const result = {
        distanceKm: (route.distance ?? 0) / 1000,
        durationMin: (route.duration ?? 0) / 60,
        coords // ใช้สำหรับวาดเส้น
    };

    cache.set(key, result);
    return result;
    // return null;
}

export async function computeTravelTimes(locations, signal) {
    if (!Array.isArray(locations) || locations.length < 2) return [];
    const tasks = [];
    for (let i = 0; i < locations.length - 1; i++) {
        tasks.push(getTravelBetween(locations[i], locations[i + 1], signal));
    }
    return Promise.all(tasks);
}