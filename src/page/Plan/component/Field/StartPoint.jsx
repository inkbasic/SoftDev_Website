import { useState, useEffect, useRef } from "react";
import { getTravelBetween } from "@/lib/routeService";

export default function StartPoint({ value, onChange, firstLocation, onRouteComputed, isEditing = true }) {

    const [travel, setTravel] = useState(null); // { distanceKm, durationMin, coords }
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(false);
    const [error, setError] = useState("");
    const [lastCoords, setLastCoords] = useState(() => {
        try {
            const raw = localStorage.getItem("startPoint:last");
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    });
    const autoAttemptRef = useRef(false);
    const geoSeedRef = useRef(false);

    // Sync local state when value changes (e.g., load from server)
    // โหมดโรงแรมถูกยกเลิกแล้ว ไม่ต้องซิงค์
    useEffect(() => {}, []);

    // อ่านตำแหน่งปัจจุบันแบบพยายามหลายครั้ง แล้วเลือกค่าที่แม่นสุด (accuracy ต่ำสุด)
    const getStableCurrentPosition = async (attempts = 3, perTimeout = 8000) => {
        if (!navigator.geolocation) throw new Error("Geolocation ไม่รองรับ");
        const getOnce = () => new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve(pos),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: perTimeout, maximumAge: 0 }
            );
        });
        const results = [];
        for (let i = 0; i < attempts; i++) {
            try {
                const p = await getOnce();
                results.push(p);
                // หยุดก่อนถ้าความแม่นยำดีมาก (< 50 เมตร)
                if (p.coords && typeof p.coords.accuracy === 'number' && p.coords.accuracy < 50) break;
            } catch (e) {
                // ลองรอบถัดไป
            }
        }
        if (!results.length) throw new Error("ไม่สามารถอ่านตำแหน่งได้");
        results.sort((a, b) => (a.coords.accuracy || 1e9) - (b.coords.accuracy || 1e9));
        return results[0];
    };

    const commitCurrent = async () => {
        setLocLoading(true);
        setError("");
        try {
            let lat = 13.7563, lng = 100.5018;
            try {
                const pos = await getStableCurrentPosition(3, 8000);
                lat = pos.coords.latitude;
                lng = pos.coords.longitude;
                // cache ค่าล่าสุด
                localStorage.setItem("startPoint:last", JSON.stringify([lat, lng]));
                setLastCoords([lat, lng]);
            } catch (e) {
                // ใช้ cache ถ้ามี
                if (Array.isArray(lastCoords)) {
                    lat = lastCoords[0];
                    lng = lastCoords[1];
                }
            }
            // schedule update after render to avoid parent update during render
            setTimeout(() => {
                onChange?.({
                    type: "current",
                    id: "start",
                    name: "จุดเริ่มต้น (ตำแหน่งปัจจุบัน)",
                    source: [lat, lng],
                    position: [lat, lng],
                    order: 0,
                    isStart: true
                });
            }, 0);
        } catch (e) {
            setError("ไม่สามารถตั้งค่าตำแหน่งปัจจุบันได้");
        } finally {
            setLocLoading(false);
        }
    };

    const handleReset = async () => {
        // เคลียร์สถานะทั้งหมดของส่วนนี้ และเริ่มใหม่อีกครั้ง
        try {
            autoAttemptRef.current = false;
            setError("");
            setTravel(null);
            setLoading(false);
            setLocLoading(false);
            // ล้าง startPoint ออกจากแผนชั่วคราว
            // schedule clearing after render to avoid cross-component update warnings
            setTimeout(() => onChange?.(null), 0);
        } finally {
            // ลองตั้งค่าตำแหน่งอีกครั้งทันทีถ้าอยู่ในโหมดแก้ไขและมีสถานที่แรก
            if (isEditing && firstLocation) {
                // ให้เวลาวน render หนึ่งเฟรมก่อน เพื่อให้ onChange สะท้อน
                setTimeout(() => { commitCurrent(); }, 0);
            }
        }
    };

    // โหมดโรงแรมถูกยกเลิกแล้ว

    useEffect(() => {
        // ไม่อัปเดตอัตโนมัติแล้ว เพื่อความเสถียร ให้ผู้ใช้กดปุ่มกำหนดเอง
        setTravel(null);
    }, []);

    // โหลดค่าจาก cache เป็นค่าเริ่มต้นถ้ายังไม่มีค่า (ทำเฉพาะโหมดแก้ไข)
    useEffect(() => {
        if (isEditing && !value && Array.isArray(lastCoords)) {
            // แสดงผลในสรุปการเดินทางได้ แม้ยังไม่บันทึก
            onChange?.({
                type: "current",
                id: "start",
                name: "จุดเริ่มต้น (ตำแหน่งล่าสุด)",
                source: lastCoords,
                position: lastCoords,
                order: 0,
                isStart: true
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing]);

    // ถ้ามีสถานที่แรกแล้ว แต่ยังไม่มี startPoint และเป็นโหมดแก้ไข ให้ลองตั้งค่าตำแหน่งปัจจุบันอัตโนมัติหนึ่งครั้ง
    useEffect(() => {
        if (!isEditing) return;
        if (autoAttemptRef.current) return;
        if (firstLocation && !value) {
            autoAttemptRef.current = true;
            // ไม่ต้อง await เพื่อไม่บล็อก UI
            commitCurrent();
        }
    }, [firstLocation?.id, isEditing, value]);

    // VIEW mode: ถ้ายังไม่มี startPoint และไม่มี cache ให้ seed lastCoords อัตโนมัติจาก geolocation หรือ fallback
    useEffect(() => {
        if (isEditing) return; // โหมดดูเท่านั้น
        if (geoSeedRef.current) return;
        if (!firstLocation) return;
        if (value) return; // มี startPoint อยู่แล้ว
        if (Array.isArray(lastCoords)) return; // มี cache แล้ว
        geoSeedRef.current = true;
        (async () => {
            try {
                const pos = await getStableCurrentPosition(2, 6000);
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                localStorage.setItem("startPoint:last", JSON.stringify([lat, lng]));
                setLastCoords([lat, lng]);
            } catch {
                // fallback กรุงเทพเพื่อให้มี travel อย่างน้อย
                const fallback = [13.7563, 100.5018];
                try { localStorage.setItem("startPoint:last", JSON.stringify(fallback)); } catch {}
                setLastCoords(fallback);
            }
        })();
    }, [isEditing, firstLocation, value, lastCoords]);

    const extractCoords = (obj) => {
        if (!obj) return null;
        if (Array.isArray(obj.source) && obj.source.length === 2) return obj.source;
        if (Array.isArray(obj.position) && obj.position.length === 2) return obj.position;
        if (Array.isArray(obj?.raw?.location) && obj.raw.location.length === 2) return obj.raw.location;
        if (typeof obj.latitude === 'number' && typeof obj.longitude === 'number') return [obj.latitude, obj.longitude];
        return null;
    };

    const toLatLng = (pair) => {
        if (!Array.isArray(pair) || pair.length !== 2) return null;
        const a = Number(pair[0]);
        const b = Number(pair[1]);
        if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
        const aIsLat = Math.abs(a) <= 90;
        const bIsLat = Math.abs(b) <= 90;
        if (!aIsLat && bIsLat) return [b, a];
        if (aIsLat && !bIsLat) return [a, b];
        return [a, b];
    };

    const haversineKm = (A, B) => {
        const [lat1, lon1] = A.map(x => x * Math.PI / 180);
        const [lat2, lon2] = B.map(x => x * Math.PI / 180);
        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;
        const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
        const c = 2 * Math.asin(Math.sqrt(a));
        return 6371 * c;
    };

    useEffect(() => {
        const abort = new AbortController();
        const compute = async () => {
            setError("");
            setTravel(null);
            const startCandidate = value || (Array.isArray(lastCoords) ? { position: lastCoords } : null);
            if (!startCandidate || !firstLocation) return;
            setLoading(true);
            try {
                const res = await getTravelBetween(startCandidate, firstLocation, abort.signal);
                if (res) {
                    setTravel(res);
                    onRouteComputed?.(res);
                } else {
                    // Fallback: คำนวณระยะทางเส้นตรงและเวลาโดยประมาณ
                    const A0 = toLatLng(extractCoords(startCandidate));
                    const B0 = toLatLng(extractCoords(firstLocation));
                    if (A0 && B0) {
                        const distanceKm = haversineKm(A0, B0);
                        const avgKmh = 35; // ความเร็วเฉลี่ยโดยประมาณ
                        const durationMin = (distanceKm / avgKmh) * 60;
                        const fallback = { distanceKm, durationMin, coords: [A0, B0] };
                        setTravel(fallback);
                        onRouteComputed?.(fallback);
                    } else {
                        setError("ไม่พบเส้นทาง");
                    }
                }
            } catch {
                // Fallback on error เช่น เครือข่าย/CORS
                const A0 = toLatLng(extractCoords(startCandidate));
                const B0 = toLatLng(extractCoords(firstLocation));
                if (A0 && B0) {
                    const distanceKm = haversineKm(A0, B0);
                    const avgKmh = 35;
                    const durationMin = (distanceKm / avgKmh) * 60;
                    const fallback = { distanceKm, durationMin, coords: [A0, B0] };
                    setTravel(fallback);
                    onRouteComputed?.(fallback);
                } else {
                    setError("คำนวณไม่สำเร็จ");
                }
            } finally {
                setLoading(false);
            }
        };
        compute();
        return () => abort.abort();
    }, [value?.position, value?.latitude, value?.longitude, lastCoords?.[0], lastCoords?.[1], firstLocation?.id]);

    // โหมดโรงแรมถูกยกเลิกแล้ว จึงไม่ต้องคำนวณ selectedStart

    return (
        <>
            <div className="flex items-center justify-between w-full">
                <h3 >จุดเริ่มต้นการเดินทาง</h3>
            </div>

            {/* โหมดโรงแรมถูกลบออก */}

            {/* โหมดตำแหน่งปัจจุบัน: แสดงปุ่มสำหรับตั้งค่าหรืออัปเดตให้ผู้ใช้กดเอง */}
            {/* {isEditing && (
                <div className="mt-3 flex items-center gap-3">
                    <button
                        onClick={commitCurrent}
                        disabled={locLoading}
                        className={`px-3 py-2 rounded-md border ${locLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-neutral-50 cursor-pointer'}`}
                    >
                        {locLoading ? 'กำลังอ่านตำแหน่ง…' : (value ? 'อัปเดตเป็นตำแหน่งปัจจุบัน' : 'ตั้งค่าเป็นตำแหน่งปัจจุบัน')}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={locLoading || loading}
                        className={`px-3 py-2 rounded-md border ${locLoading || loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-neutral-50 cursor-pointer'}`}
                        title="รีเซ็ตและลองใหม่"
                    >
                        รีเซ็ต
                    </button>
                    {Array.isArray(lastCoords) && (
                        <span className="text-xs text-neutral-500">ตำแหน่งล่าสุด: {lastCoords[0].toFixed(5)}, {lastCoords[1].toFixed(5)}</span>
                    )}
                    {error && (
                        <span className="text-xs text-red-500">{error}</span>
                    )}
                </div>
            )} */}

            <div className="mt-5 text-neutral-700 flex gap-2">
                <p>เวลาเดินทางจากจุดเริ่มต้นไปยังสถานที่แรก :</p>
                {loading ? (
                    <p className="text-neutral-500">กำลังคำนวณ…</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : travel ? (
                    <>
                        <p className="">{Math.round(travel.durationMin)} นาที - ระยะทาง {travel.distanceKm.toFixed(1)} กม.</p>
                    </>
                ) : (
                    <p className="text-neutral-500">กำลังตั้งค่าตำแหน่งเริ่มต้น…</p>
                )}
            </div>
        </>
    );
}