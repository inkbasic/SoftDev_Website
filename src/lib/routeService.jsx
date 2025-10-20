const cache = new Map();

const getCoords = (loc) => {
    if (!loc) return null;
    if (Array.isArray(loc.source) && loc.source.length === 2) {
        const [lat, lng] = loc.source;
        return [Number(lat), Number(lng)];
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
}

export async function computeTravelTimes(locations, signal) {
    if (!Array.isArray(locations) || locations.length < 2) return [];
    const tasks = [];
    for (let i = 0; i < locations.length - 1; i++) {
        tasks.push(getTravelBetween(locations[i], locations[i + 1], signal));
    }
    return Promise.all(tasks);
}