import Card from "./Card";
import Info from "./Info";
import Car from "/Car.png";
import CarSection from "./CarSection";
import Itetary from "./Itetary";
import { CancelButton, SaveButton, MeatButton } from "./Button";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";
import { href, useNavigate } from "react-router-dom";
import StartPoint from "./StartPoint";

const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;

function getToken() {
    // Read jwtToken from cookies (prefer HttpOnly cookie flow; header added only if readable and valid)
    if (typeof document === "undefined" || !document.cookie) return null;
    const match = document.cookie.match(/(?:^|;\s*)jwtToken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

const Field = forwardRef(({ planData, onDataChange, padding }, ref) => {
    const [isEditing, setIsEditing] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [data, setData] = useState(planData || {});
    // เก็บ snapshot ล่าสุดแบบ synchronous เพื่อกัน state lag (เช่น ขณะลาก/ปล่อย)
    const latestPlanRef = useRef(planData || {});

    const navigate = useNavigate();

    useEffect(() => {
        setData(planData);
        latestPlanRef.current = planData || {};
    }, [planData]);

    // เพิ่ม callback สำหรับรับการเปลี่ยนแปลงจาก Itinerary
    const handleItineraryDataChange = (updatedData) => {
        setData(updatedData);
        latestPlanRef.current = updatedData; // sync snapshot ล่าสุดทันที
        // ส่งต่อไปยัง parent
        if (onDataChange) {
            onDataChange(updatedData);
        }
    };

    const fieldRef = useRef(null);
    const menuRef = useRef(null);
    useAutoHideScrollbar(fieldRef);

    const overviewRef = useRef(null);
    const carRef = useRef(null);
    const startPointRef = useRef(null);
    const itetaryRef = useRef(null);
    const dateRefs = useRef(null);

    const scrollToSection = (sectionName) => {
        let targetRef = null;

        switch (sectionName) {
            case 'ภาพรวม':
                targetRef = overviewRef;
                break;
            case 'เช่ารถ':
                targetRef = carRef;
                break;
            case 'จุดเริ่มต้น':
                targetRef = startPointRef;
                break;
            case 'กำหนดการ':
                targetRef = itetaryRef;
                break;
            default:
                if (dateRefs && dateRefs.current && dateRefs.current.scrollToDate) {
                    dateRefs.current.scrollToDate(sectionName);
                }
                return;
        }

        if (targetRef && targetRef.current) {
            targetRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && event.target && menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    // แปลง/ทำความสะอาดข้อมูลก่อนส่งไป backend
    // - ตัด field หนัก ๆ ออก (เช่น raw)
    // - map location ให้ตรงกับรูปแบบ place ของ backend แต่ "เพิ่ม startTime, endTime"
    // - itinerary: คง key เป็น YYYY-MM-DD แต่ภายในเหลือเฉพาะ description, location (array)
    const buildSavePayload = (snapshot) => {
        const safe = { ...snapshot };
        const stripUndef = (obj) => {
            if (!obj || typeof obj !== 'object') return obj;
            const out = { ...obj };
            Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
            return out;
        };

        // ป้องกันกรณีไม่มี itinerary
        const iti = safe?.itinerary && typeof safe.itinerary === 'object' ? safe.itinerary : {};
        const outItinerary = {};

        // sort key เพื่อความคงที่ของ payload
        const dateKeys = Object.keys(iti).sort();
        for (const dk of dateKeys) {
            const day = iti[dk] || {};
            const desc = day.description || "";
            const locs = Array.isArray(day.locations) ? day.locations : [];

            const mappedLocations = locs.map((l) => {
                // คำนวณพิกัดเป็นรูปแบบ backend [lng, lat] โดยอนุมาน order ของคู่ตัวเลข
                const toLatLng = (arr) => {
                    if (!Array.isArray(arr) || arr.length < 2) return [undefined, undefined];
                    const a = Number(arr[0]);
                    const b = Number(arr[1]);
                    if (!Number.isFinite(a) || !Number.isFinite(b)) return [undefined, undefined];
                    const aIsLat = Math.abs(a) <= 90;
                    const bIsLat = Math.abs(b) <= 90;
                    if (!aIsLat && bIsLat) return [b, a]; // [lng,lat] -> [lat,lng]
                    if (aIsLat && !bIsLat) return [a, b]; // [lat,lng]
                    return [a, b]; // ambiguous → assume [lat,lng]
                };

                let lat, lng;
                if (Array.isArray(l?.source)) {
                    [lat, lng] = toLatLng(l.source);
                } else if (Array.isArray(l?.position)) {
                    [lat, lng] = toLatLng(l.position);
                } else if (Array.isArray(l?.raw?.location)) {
                    [lat, lng] = toLatLng(l.raw.location);
                }

                let locArray = (typeof lat === 'number' && typeof lng === 'number') ? [lng, lat] : undefined;

                const obj = {
                    _id: l.id,
                    name: l.name,
                    imageUrl: l.image || l?.raw?.imageUrl,
                    location: locArray,
                    description: l.description ?? l?.raw?.description,
                    providerId: l?.raw?.providerId,
                    tags: Array.isArray(l?.tags) ? l.tags : (Array.isArray(l?.raw?.tags) ? l.raw.tags : undefined),
                    type: l.category || l?.raw?.type,
                    startTime: l.startTime || null,
                    endTime: l.endTime || null,
                };
                return stripUndef(obj);
            });

            outItinerary[dk] = {
                description: desc,
                locations: mappedLocations,
            };
        }

        // สร้าง payload ที่ต้องการส่งจริง: ตัด field UI ออก เช่น dayName/date ในแต่ละวัน
        const payload = {
            _id: safe?._id,
            title: safe?.title,
            startDate: safe?.startDate,
            endDate: safe?.endDate,
            budget: safe?.budget,
            people: safe?.people,
            ownerId: safe?.ownerId,
            where: safe?.where,
            transportation: "รถยนต์ส่วนตัว",
            category: safe?.category,
            // source: safe?.startPoint ? {
            //     type: safe.startPoint.type,
            //     refId: safe.startPoint.refId || undefined,
            //     position: safe.startPoint.position || safe.startPoint.source || undefined,
            // } : undefined,
            source: safe?.startPoint ? 
                safe.startPoint.position || safe.startPoint.source || undefined
             : undefined,
            itinerary: outItinerary,
        };

        // ลบคีย์ที่ undefined ออกเพื่อความสะอาด
        Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
        console.log("Built save payload:", payload);
        return payload;
    };

    const handleSave = async () => {
        if (!data) return;
        setIsSaving(true);

        try {
            // เตรียม payload จาก snapshot ล่าสุด เพื่อให้ itinerary/วันที่ ทันสมัยที่สุด
            const snapshot = latestPlanRef.current && Object.keys(latestPlanRef.current).length
                ? latestPlanRef.current
                : data;
            const payload = buildSavePayload(snapshot);

            // ใส่ Header ตามปกติ และแนบ Authorization เมื่อมี token ที่ดูเหมือนจริง
            const headers = { "Content-Type": "application/json" };
            const token = getToken();
            if (token && token !== "jwtToken" && token.split(".").length === 3) {
                headers.Authorization = `Bearer ${token}`;
            }

            const base = BASE_URL || "http://localhost:3000";
            let url = `${base}/plans`;
            let method = "POST";

            // ถ้ามี _id ให้ถือว่าเป็นการอัปเดตแผนเดิม
            if (snapshot && snapshot._id) {
                // ใช้ _id จาก snapshot เดิมเพื่อระบุ resource ที่จะอัปเดต
                url = `${base}/plans/${snapshot._id}`;
                method = "PUT"; // หาก backend ต้องการ PATCH ให้สลับได้
            }

            const res = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(payload),
            });

            const raw = await res.text();
            let body;
            try {
                body = raw ? JSON.parse(raw) : null;
            } catch {
                body = raw;
            }
            console.log(method, url, "=>", res.status, body);

            if (!res.ok) {
                throw new Error(body?.message || "บันทึกไม่สำเร็จ");
            }

            // อัปเดตสถานะด้วยข้อมูลจาก server (กันค่า server ที่เติมให้ เช่น _id, updatedAt)
            const updated = { ...data, ...(body || {}) };
            setData(updated);
            onDataChange?.(updated);

            // ถ้าเป็นการสร้างใหม่และ server ส่ง _id กลับมา ให้เปลี่ยนเส้นทางไปที่ /plan/:id
            if (method === "POST" && body && body._id) {
                navigate(`/plan/${body._id}`, { replace: true });
            }

            setIsEditing(false);
        } catch (err) {
            console.error("Save plan failed:", err);
            if (typeof window !== "undefined") {
                alert(`บันทึกไม่สำเร็จ: ${err?.message || err}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleToggleMenu = () => {
        setShowMenu(prev => !prev);
    }

    const handleEdit = () => {
        setShowMenu(false)
        setIsEditing(true);
    };

    const copyToClipboard = async (text) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch {}
        // Fallback for non-secure context or older browsers
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.top = '-9999px';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch {
            return false;
        }
    };

    const handleShare = async () => {
        try {
            const url = window?.location?.href || '';
            const ok = await copyToClipboard(url);
            setShowMenu(false);
            if (ok) {
                alert('คัดลอกลิงก์แล้ว');
            } else {
                alert('ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาคัดลอกเอง: ' + url);
            }
        } catch (e) {
            setShowMenu(false);
            alert('เกิดข้อผิดพลาดในการคัดลอกลิงก์');
        }
    };

    const handleStartPointChange = (startPoint) => {
        const updated = { ...(data || {}), startPoint };
        setData(updated);
        latestPlanRef.current = updated;
        onDataChange?.(updated);
    };

    // หา "สถานที่แรก" ของทริปจาก itinerary (วันที่แรกที่มี locations)
    const firstLocation = (() => {
        const iti = data?.itinerary || {};
        const keys = Object.keys(iti).sort();
        for (const k of keys) {
            const locs = iti[k]?.locations || [];
            if (locs.length > 0) return locs[0];
        }
        return null;
    })();

    useImperativeHandle(ref, () => ({
        scrollToSection,
        getItineraryRef: () => dateRefs.current
        // ลบ getCurrentData ออก
    }));

    return (
        <div
            className={`h-full w-full flex flex-col gap-5 ${padding} py-5 justify-start items-center bg-paper overflow-x-visible overflow-y-auto scroll-auto-hide`}
            ref={fieldRef}
        >
            {/* Overview Section */}
            <div ref={overviewRef} className="w-full flex flex-col gap-1">
                <div className="flex justify-between items-center w-full">
                    <h3>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => {
                                const updated = { ...data, title: e.target.value };
                                setData(updated);
                                latestPlanRef.current = { ...latestPlanRef.current, title: e.target.value };
                            }}
                        />
                    </h3>
                    <div className="flex gap-3 relative">
                        {isEditing ? (
                            <>
                                <CancelButton onClick={handleCancel} />
                                <SaveButton onClick={handleSave} />
                            </>
                        ) : (
                            <MeatButton onClick={handleToggleMenu} click={showMenu}>
                                {showMenu && (
                                    <div ref={menuRef} className="absolute right-0 top-full mt-1 w-30 bg-white border border-neutral-200 rounded-md shadow-lg z-10 overflow-hidden">
                                        <p onClick={handleShare} className="px-2 py-1 cursor-pointer hover:bg-neutral-200">แชร์</p>
                                        <p onClick={handleEdit} className="px-2 py-1 cursor-pointer hover:bg-neutral-200">แก้ไข</p>
                                        <p onClick={() => navigate("/")} className="px-2 py-1 cursor-pointer hover:bg-neutral-200">ลบ</p>
                                    </div>
                                )}
                            </MeatButton>
                        )}
                    </div>
                </div>
                {/* <p className="text-neutral-500">แก้ไขล่าสุด : {data.lastModified}</p> */}
            </div>

            <Card>
                <Info
                    data={data}
                    isEditing={isEditing}
                    onChange={(patch) => {
                        const updated = { ...(data || {}), ...(patch || {}) };
                        setData(updated);
                        latestPlanRef.current = updated;
                        onDataChange?.(updated);
                    }}
                />
            </Card>

            {/* Car / Rental Section */}
            <div ref={carRef} className="w-full">
                <CarSection
                    value={data?.transport}
                    onChange={(transport) => {
                        const updated = { ...(data || {}), transport };
                        setData(updated);
                        latestPlanRef.current = updated;
                        onDataChange?.(updated);
                    }}
                />
            </div>

            {/* จุดเริ่มต้นการเดินทาง */}
            <div ref={startPointRef} className="w-full">
                <StartPoint
                    value={data?.startPoint}
                    onChange={handleStartPointChange}
                    firstLocation={firstLocation}
                />
            </div>

            {/* Itinerary Section */}
            <div className="w-full" ref={itetaryRef}>
                <Itetary
                    planData={data}
                    isEditing={isEditing}
                    ref={dateRefs}
                    onDataChange={handleItineraryDataChange}
                />
            </div>
        </div>
    );
});

Field.displayName = 'Field';

export default Field;