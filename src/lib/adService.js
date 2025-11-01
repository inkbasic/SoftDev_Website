const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3000';

function getToken() {
    if (typeof document === 'undefined' || !document.cookie) return null;
    const match = document.cookie.match(/(?:^|;\s*)jwtToken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

async function patch(endpoint) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        const token = getToken();
        if (token && token !== 'jwtToken' && token.split('.').length === 3) {
            headers.Authorization = `Bearer ${token}`;
        }
        const res = await fetch(endpoint, { method: 'PATCH', headers });
        // ไม่ต้อง throw หากไม่สำเร็จ เพื่อลดผลกระทบกับ UX
        const raw = await res.text();
        let data; try { data = raw ? JSON.parse(raw) : []; } catch { data = []; }
        console.log(data);
        if (!res.ok) {
            const text = await res.text();
            console.warn('Ad track failed', res.status, endpoint, text);
        }
    } catch (e) {
        console.warn('Ad track error', endpoint, e);
    }
}

export async function patchAdView(id) {
    if (!id) return;
    const url = `${BASE_URL}/ad/${encodeURIComponent(id)}/view`;
    return patch(url);
}

export async function patchAdClick(id) {
    if (!id) return;
    const url = `${BASE_URL}/ad/${encodeURIComponent(id)}/click`;
    return patch(url);
}

// Helper: เรียกทั้ง view และ click เมื่อสถานที่ถูกเพิ่มเข้าแผน (fire-and-forget)
export function trackAdAddedToPlan(id) {
    if (!id) return;
    // กันแจ้งไปยัง backend สำหรับ id ชั่วคราวจากฝั่ง client
    if (/^(location-|custom-)/.test(String(id))) return;
    // ไม่ await เพื่อลดดีเลย์ UI
    patchAdView(id);
    patchAdClick(id);
}
