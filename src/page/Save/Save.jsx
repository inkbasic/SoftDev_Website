// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Funnel, ChevronDown, Ellipsis, Briefcase, Users } from "lucide-react";

// export function TripCard({ title, date, badges, description, maxDescLength = 125 }) {
//     const shortDesc = description.length > maxDescLength ? description.slice(0, maxDescLength) + " ..." : description;

//     return (
//         <Card className="p-6">
//             <div className="flex flex-col gap-2">
//                 <div className="flex justify-between">
//                     <div className="flex flex-col gap-1">
//                         <h4>{title}</h4>
//                         <p className="text-sm text-neutral-500">{date}</p>
//                     </div>
//                     <Ellipsis />
//                 </div>

//                 {/* Badge */}
//                 <div className="flex flex-wrap gap-1">
//                     {badges.map((b, idx) => (
//                         <Badge
//                             key={idx}
//                             variant="secondary"
//                             style={b.color ? { backgroundColor: b.color } : undefined} // ใช้ style แทน class
//                         >
//                             {b.isProvince && <Briefcase className="w-4 h-4 mr-1" />}
//                             {b.isPeople && <Users className="w-4 h-4 mr-1" />}
//                             {b.label}
//                         </Badge>
//                     ))}
//                 </div>
//             </div>

//             {/* detail */}
//             <p className="mt-1 text-sm">{shortDesc}</p>
//         </Card>
//     );
// }

// export default function Save() {
//     return (
//         <div className="flex flex-col items-center justify-center gap-12 px-6 py-20">
//             <header className="flex flex-col items-start justify-between w-full max-w-5xl gap-3 lg:flex-row lg:items-center">
//                 <div className="flex flex-col w-full gap-2 sm:flex-row lg:gap-6 lg:max-w-xl">
//                     <h1 className="text-2xl font-semibold text-nowrap">แผนท่องเที่ยวทั้งหมด</h1>
//                     <Input type="text" placeholder="ค้นหาจากรายการผ่านชื่อ / แท็ก" />
//                 </div>
//                 <Button variant="destructive">
//                     <Funnel />
//                     ตัวกรอง
//                     <ChevronDown />
//                 </Button>
//             </header>
//             <main className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
//                 {Array.from({ length: 8 }).map((_, index) => (
//                     <TripCard
//                         key={index}
//                         title="📍 ทริปเชียงใหม่สามวันสามคืน"
//                         date="10–12 พฤศจิกายน 2025"
//                         description="ทริปเชียงใหม่ 3 วัน 2 คืน เหมาะสำหรับคนชอบธรรมชาติและวัฒนธรรม เที่ยววัดพระธาตุดอยสุเทพ ชมวิวเมือง ปิดท้ายซื้อของฝากก่อนเดินทางกลับ กรุงเทพฯ"
//                         badges={[
//                             { label: "เชียงใหม่", color: "#DDFAE7", isProvince: true },
//                             { label: "4 คน", color: "#DDF2FF", isPeople: true },
//                             { label: "คนชรา", color: "#CBFAF0" },
//                         ]}
//                     />
//                 ))}
//             </main>
//         </div>
//     );
// }

// src/pages/SavePlans.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Funnel, ChevronDown, Ellipsis, Briefcase, Users } from "lucide-react";

/* ----------------------------- Utilities ----------------------------- */
// อ่าน token จาก localStorage/sessionStorage
function getToken() {
    return localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken") || "jwtToken";
}

// รวม URL กันพลาดสแลชซ้ำ/ขาด (ถ้าใน dev ใช้ proxy, ให้ตั้ง API_BASE = "")
function joinUrl(base, path) {
    const b = (base || "").replace(/\/+$/, "");
    const p = (path || "").replace(/^\/+/, "");
    return `${b}/${p}`;
}

// ฟอร์แมต date-range ไทยจาก ISO (รับรูปแบบ ISO +07:00 ตามที่สเปกให้มา)
function formatThaiRange(startISO, endISO) {
    try {
        const s = new Date(startISO);
        const e = new Date(endISO);
        const sameDay =
            s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth() && s.getDate() === e.getDate();

        const dateOpt = { timeZone: "Asia/Bangkok", year: "numeric", month: "long", day: "numeric" };
        const timeOpt = { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit" };

        if (sameDay) {
            return `${s.toLocaleDateString("th-TH", dateOpt)} • ${s.toLocaleTimeString(
                "th-TH",
                timeOpt
            )}–${e.toLocaleTimeString("th-TH", timeOpt)}`;
        }
        return `${s.toLocaleDateString("th-TH", dateOpt)} – ${e.toLocaleDateString("th-TH", dateOpt)}`;
    } catch {
        return `${startISO} – ${endISO}`;
    }
}

// สีกลุ่ม badge แบบง่าย
const COLOR = {
    province: "#DDFAE7",
    people: "#DDF2FF",
    tag: "#CBFAF0",
};

/* ----------------------------- UI: TripCard ----------------------------- */
export function TripCard({ title, date, badges, description, maxDescLength = 125 }) {
    const shortDesc =
        (description || "").length > maxDescLength ? description.slice(0, maxDescLength) + " ..." : description || "-";

    return (
        <Card className="p-6">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-sm text-neutral-500">{date}</p>
                    </div>
                    <Ellipsis className="text-neutral-500" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                    {badges.map((b, idx) => (
                        <Badge key={idx} variant="secondary" style={b.color ? { backgroundColor: b.color } : undefined}>
                            {b.isProvince && <Briefcase className="w-4 h-4 mr-1" />}
                            {b.isPeople && <Users className="w-4 h-4 mr-1" />}
                            {b.label}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* detail */}
            <p className="mt-1 text-sm">{shortDesc}</p>
        </Card>
    );
}

/* ----------------------------- Main Page ----------------------------- */
export default function SavePlans() {
    // ตั้ง base URL ผ่าน .env (ถ้าใช้ Vite proxy ให้ปล่อยว่าง)
    const API_BASE = import.meta.env.VITE_API_BASE || "";
    const ENDPOINT = "/plans";

    const [plans, setPlans] = useState([]); // ข้อมูลดิบจาก API (array)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // เก็บข้อความ error เพื่อแสดงผล
    const [q, setQ] = useState(""); // คำค้นหา (ชื่อ/แท็ก/จุดหมาย)
    const [onlyUpcoming, setOnlyUpcoming] = useState(false); // ตัวอย่างตัวกรองอย่างง่าย

    // ดึงข้อมูลจาก API
    useEffect(() => {
        let aborted = false;

        async function fetchPlans() {
            setLoading(true);
            setError("");
            try {
                const url = joinUrl(API_BASE, ENDPOINT);
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Cache-Control": "no-cache",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    cache: "no-store",
                });

                // รองรับกรณีตอบ 304/204 หรือ content-type แปลก ๆ
                let data = null;
                const ct = res.headers.get("content-type") || "";
                if (res.status === 204) data = [];
                else if (ct.includes("application/json")) data = await res.json();
                else {
                    const text = await res.text();
                    try {
                        data = JSON.parse(text);
                    } catch {
                        data = [];
                    }
                }

                if (!res.ok) {
                    const msg = (data && (data.message || data.error)) || `${res.status} ${res.statusText}`;
                    throw new Error(msg);
                }

                if (!aborted) setPlans(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!aborted) setError(e?.message || "โหลดข้อมูลล้มเหลว");
            } finally {
                if (!aborted) setLoading(false);
            }
        }

        fetchPlans();
        return () => {
            aborted = true;
        };
    }, [API_BASE]);

    // แปลงข้อมูล plan -> props ของการ์ด + ค้นหา/กรอง
    const filtered = useMemo(() => {
        const now = Date.now();
        const term = q.trim().toLowerCase();

        return (plans || []).filter((p) => {
            const withinUpcoming = !onlyUpcoming || (p?.endTime && new Date(p.endTime).getTime() >= now);
            const inText =
                !term ||
                (p?.name && p.name.toLowerCase().includes(term)) ||
                (p?.destination && p.destination.toLowerCase().includes(term)) ||
                (Array.isArray(p?.preferredTags) && p.preferredTags.join(" ").toLowerCase().includes(term)) ||
                (Array.isArray(p?.source) && p.source.join(" ").toLowerCase().includes(term));
            return withinUpcoming && inText;
        });
    }, [plans, q, onlyUpcoming]);

    // สร้าง badge สำหรับแต่ละทริป
    function toBadges(plan) {
        const badges = [];
        if (plan?.destination) badges.push({ label: plan.destination, color: COLOR.province, isProvince: true });
        if (Number.isFinite(Number(plan?.groupSize)))
            badges.push({ label: `${plan.groupSize} คน`, color: COLOR.people, isPeople: true });
        if (Array.isArray(plan?.preferredTags)) {
            plan.preferredTags.slice(0, 3).forEach((t) => badges.push({ label: t, color: COLOR.tag }));
        }
        return badges;
    }

    return (
        <div className="flex flex-col items-center justify-center gap-12 px-6 py-20">
            {/* Header / Controls */}
            <header className="flex flex-col items-start justify-between w-full max-w-5xl gap-3 lg:flex-row lg:items-center">
                <div className="flex flex-col w-full gap-2 sm:flex-row lg:gap-6 lg:max-w-xl">
                    <h5 className="text-2xl font-semibold text-nowrap">แผนท่องเที่ยวทั้งหมด</h5>
                    <Input
                        type="text"
                        placeholder="ค้นหาจากชื่อ / จุดหมาย / แท็ก"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={onlyUpcoming ? "default" : "outline"}
                        onClick={() => setOnlyUpcoming((v) => !v)}
                        title="แสดงเฉพาะทริปที่ยังไม่จบ"
                    >
                        <Funnel className="mr-2" />
                        เฉพาะทริปที่กำลังจะมาถึง
                        <ChevronDown className="ml-2" />
                    </Button>
                </div>
            </header>

            {/* States */}
            {loading && (
                <div className="w-full max-w-5xl">
                    <Card className="p-6">กำลังโหลดข้อมูล…</Card>
                </div>
            )}

            {!!error && (
                <div className="w-full max-w-5xl">
                    <Card className="p-6 text-red-700 border-red-300 bg-red-50">เกิดข้อผิดพลาด: {error}</Card>
                </div>
            )}

            {!loading && !error && filtered.length === 0 && (
                <div className="w-full max-w-5xl">
                    <Card className="p-6">คุณยังไม่มีแผนการท่องเที่ยว</Card>
                </div>
            )}

            {/* List */}
            {!loading && !error && filtered.length > 0 && (
                <main className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
                    {filtered.map((plan, idx) => (
                        <TripCard
                            key={plan._id || plan.id || idx}
                            title={`📍 ${plan.name || "แผนทริป"}`}
                            date={formatThaiRange(plan.startTime, plan.endTime)}
                            description={[
                                plan.source?.length ? `ออกเดินทางจาก: ${plan.source.join(", ")}` : null,
                                plan.destination ? `จุดหมาย: ${plan.destination}` : null,
                                Number.isFinite(Number(plan.budget))
                                    ? `งบประมาณ: ${Number(plan.budget).toLocaleString("th-TH")} บาท`
                                    : null,
                            ]
                                .filter(Boolean)
                                .join(" • ")}
                            badges={toBadges(plan)}
                        />
                    ))}
                </main>
            )}
        </div>
    );
}
