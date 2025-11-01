import { useRef, useState, useEffect, useMemo } from "react";
import Field from "./component/Field/Field.jsx";
import MapView from "./component/Map/Map.jsx";
import Side from "./component/Side/Side.jsx";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocation, useParams } from "react-router-dom";
import { PlanMock } from "./mock/Mock.jsx";
import { getPlaceById, getAllPlacesCached } from "@/lib/placesService";
import Cookies from "js-cookie";
import "./plan.css";
const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;

async function getToken() {
    const token = Cookies.get("jwtToken");
    if (!token) {
        let guestToken = Cookies.get("guestToken");
        if (!guestToken) {
            const base = BASE_URL || 'http://localhost:3000';
            const res = await fetch(`${base}/auth/guest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const raw = await res.text();
            let body; try { body = raw ? JSON.parse(raw) : null; } catch { body = raw; }
            console.log(body)

            guestToken = body?.token;
        }
        return guestToken;
    }

    return token;
}

// Ensure a tuple is [lat, lng]; accept [lng, lat] and infer/swap by value ranges
function toLatLng(arr) {
    if (!Array.isArray(arr) || arr.length < 2) return null;
    const a = Number(arr[0]);
    const b = Number(arr[1]);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    const aIsLat = Math.abs(a) <= 90;
    const bIsLat = Math.abs(b) <= 90;
    // If first looks like lng (>90) and second like lat (<=90) → [lng,lat] => swap
    if (!aIsLat && bIsLat) return [b, a];
    // If first looks like lat and second like lng → already [lat,lng]
    if (aIsLat && !bIsLat) return [a, b];
    // Ambiguous (both <=90 or both >90): assume [lat,lng]
    return [a, b];
}

// Helper: แปลงวันที่ใดๆ เป็นสตริง YYYY-MM-DD (ยึดค่าปฏิทินท้องถิ่น โดยไม่บังคับ setHours)
function toLocalYMD(d) {
    if (!d) return null;
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d; // ถ้าเป็น Y-M-D แล้ว ส่งกลับเลย
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return null;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

// Normalize โครงสร้างแผนจาก server → ใช้ YYYY-MM-DD
function normalizeServerPlan(plan) {
    if (!plan || typeof plan !== 'object') return plan;
    const startDate = toLocalYMD(plan.startDate) || plan.startDate;
    const endDate = toLocalYMD(plan.endDate) || plan.endDate;

    const iti = plan.itinerary || {};
    const newIti = {};
    Object.keys(iti).forEach((k) => {
        const ok = /^\d{4}-\d{2}-\d{2}$/.test(k);
        const key = ok ? k : (toLocalYMD(k) || k);
        const day = iti[k] || {};
        const locs = Array.isArray(day.locations) ? day.locations : [];
        const mapped = locs.map((l, idx) => {
            const id = l?.id ?? l?._id ?? `${key}:${idx}`;
            let src = null;
            if (Array.isArray(l?.source)) src = toLatLng(l.source);
            else if (Array.isArray(l?.position)) src = toLatLng(l.position);
            else if (Array.isArray(l?.location)) src = toLatLng(l.location);
            else if (Array.isArray(l?.location?.coordinates)) src = toLatLng(l.location.coordinates);
            else if (Array.isArray(l?.raw?.location)) src = toLatLng(l.raw.location);
            const ord = typeof l?.order === 'number' ? l.order : (idx + 1);
            return {
                ...l,
                id,
                source: src || l?.source || null,
                order: ord,
            };
        });
        newIti[key] = { ...day, locations: mapped };
    });

    return { ...plan, startDate, endDate, itinerary: newIti };
}

async function fetchPlanById(id) {
    const headers = { 'Content-Type': 'application/json' };
    const token = await getToken();
    console.log(token)
    if (token && token !== 'jwtToken' && token.split('.').length === 3) {
        headers.Authorization = `Bearer ${token}`;
    }
    const base = BASE_URL || 'http://localhost:3000';
    const url = `${base}/plans/${id}`;
    const res = await fetch(url, { method: 'GET', headers });
    const raw = await res.text();
    let body; try { body = raw ? JSON.parse(raw) : null; } catch { body = raw; }
    console.log('GET', url, '=>', res.status, body);
    if (!res.ok) throw new Error(body?.message || 'Fetch plan failed');
    return {
        plan: normalizeServerPlan(body.plan),
        isOwner: !!body?.isOwner,
    };
}

export default function Plan() {
    const homeData = useLocation();
    const { id } = useParams();
    const fieldRef = useRef(null);
    const { location: geoLocation, error, loading, getCurrentPosition } = useGeolocation();

    const [isHideMap, setIsHideMap] = useState(false);

    const isNewPlan = homeData.state?.isNew || false;

    const [currentData, setCurrentData] = useState(null);
    const [canEdit, setCanEdit] = useState(true);
    const [loadingPlan, setLoadingPlan] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                if (id) {
                    const res = await fetchPlanById(id);
                    if (!cancelled) {
                        setCurrentData(res.plan);
                        setCanEdit(!!res.isOwner);
                    }
                } else {
                    if (!cancelled) {
                        setCurrentData(PlanMock);
                        setCanEdit(true);
                    }
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) setCurrentData(PlanMock);
            } finally {
                if (!cancelled) setLoadingPlan(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    const startMarker = useMemo(() => {
        const sp = currentData?.startPoint;
        if (!sp) return null;
        const pos = toLatLng(sp.position || sp.source);
        if (!pos) return null;
        return { ...sp, position: pos, isStart: true, order: 0 };
    }, [currentData?.startPoint]);

    const markers = useMemo(() => {
        const iti = currentData?.itinerary || {};
        // เดินตามลำดับวันที่ที่เรียงแล้ว เพื่อให้หมายเลขต่อเนื่อง/ตรงกับลำดับในวัน
        const dateKeys = Object.keys(iti).sort();
        const out = [];
        let base = 0;
        dateKeys.forEach((dk) => {
            const day = iti[dk] || {};
            const locs = Array.isArray(day.locations) ? day.locations : [];
            locs.forEach((loc, idx) => {
                let pos = loc.source || loc.position || loc?.raw?.location;
                if (!Array.isArray(pos)) {
                    const p = getPlaceById?.(loc.id);
                    if (p?.source) pos = p.source;
                }
                const fixed = toLatLng(pos);
                if (!fixed) return;
                const orderInDay = typeof loc.order === 'number' ? loc.order : (idx + 1);
                out.push({
                    id: `${dk}:${loc.id}:${orderInDay}`,
                    name: loc.name,
                    position: fixed,
                    order: base + orderInDay,
                });
            });
            base += locs.length;
        });
        return out;
    }, [currentData?.itinerary]);

    // DEBUG: Log what we send to Map for marker creation
    useEffect(() => {
        try {
            // High-level objects
            if (Array.isArray(markers)) {
                // Compact table for quick inspection
                console.table(markers.map(m => ({
                    id: m.id,
                    name: m.name,
                    lat: Array.isArray(m.position) ? m.position[0] : undefined,
                    lng: Array.isArray(m.position) ? m.position[1] : undefined,
                    order: m.order,
                })));
            }
        } catch (e) {
            // noop
        }
    }, [markers, startMarker]);

    const handleSidebarItemClick = (item) => {
        if (fieldRef.current && fieldRef.current.scrollToSection) {
            fieldRef.current.scrollToSection(item);
        }
    };

    // รับการเปลี่ยนแปลงจาก Field โดยตรง
    const handleDataChange = (updatedData) => {
        // Normalize incoming updates (e.g., after save response merges _id/location)
        const normalized = normalizeServerPlan(updatedData);
        setCurrentData(normalized);
    };

    return (
        <div className="w-full h-full flex justify-center">
            <div className="flex w-full">
                {loadingPlan || !currentData ? (
                    <div className="w-full flex items-center justify-center p-4">
                        <h1>กำลังโหลด...</h1>
                    </div>
                ) : (
                    <>
                        <Side
                            onItemClick={handleSidebarItemClick}
                            fieldRef={fieldRef}
                            planData={currentData}
                        />
                        <Field
                            ref={fieldRef}
                            planData={currentData}
                            onDataChange={handleDataChange}
                            padding={isHideMap ? 'px-80' : 'px-20'}
                            canEdit={canEdit}
                            autoEdit={isNewPlan}
                        />
                    </>
                )}
            </div>

            <div className={`w-full h-full flex items-center justify-center ` + (isHideMap ? 'hidden' : '')}>
                {loading || loadingPlan || !currentData ? (
                    <h1 className="p-4">กำลังโหลด...</h1>
                ) : (
                    <MapView
                        center={geoLocation ? [geoLocation.latitude, geoLocation.longitude] : [13.7563, 100.5018]}
                        markers={markers}
                        startMarker={startMarker} // ส่งจุดเริ่มต้น
                    />
                )}
                {/* {error && (
                    <div className="p-4 text-red-500">
                        ไม่สามารถดึงตำแหน่งได้: {error}
                        <button
                            onClick={getCurrentPosition}
                            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                        >
                            ลองใหม่
                        </button>
                    </div>
                )} */}
            </div>
            <button onClick={() => setIsHideMap(!isHideMap)} className="bg-white cursor-pointer hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-md absolute bottom-8 right-4 z-[1000]" title="ปรับมุมมอง">
                <p>{isHideMap ? 'แสดงแผนที่' : 'ซ่อนแผนที่'}</p>
            </button>
        </div>
    );
}