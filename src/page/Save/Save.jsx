import { useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { Funnel, ChevronDown, Ellipsis, Briefcase, Users, CircleDollarSign, Trash2, Share2 } from "lucide-react";

/* ----------------------------- Utilities ----------------------------- */
// อ่าน token จาก Cookies
function getToken() {
    return Cookies.get("jwtToken") || ""; 
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
export function TripCard({ id, title, date, badges, description, budget, province, people, category, maxDescLength = 125, onDelete }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const shortDesc =
        (description || "").length > maxDescLength ? description.slice(0, maxDescLength) + " ..." : description || "-";

    const handleCardClick = () => {
        if (id && !showMenu) {
            navigate(`/plans/${id}`);
        }
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        const url = `${window.location.origin}/plans/${id}`;
        
        try {
            await navigator.clipboard.writeText(url);
            alert("คัดลอกลิงก์เรียบร้อยแล้ว!");
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert("คัดลอกลิงก์เรียบร้อยแล้ว!");
        }
        setShowMenu(false);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        
        if (!confirm("คุณแน่ใจหรือไม่ที่จะลบแผนการท่องเที่ยวนี้?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const API_BASE = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:3000";
            const res = await fetch(`${API_BASE}/plans/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `${res.status} ${res.statusText}`);
            }

            // alert("ลบแผนการท่องเที่ยวเรียบร้อยแล้ว!");
            if (onDelete) onDelete(id);
        } catch (error) {
            alert(`เกิดข้อผิดพลาดในการลบ: ${error.message}`);
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
        }
    };

    return (
        <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 relative" 
            onClick={handleCardClick}
        >
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-sm text-neutral-500">{date}</p>
                    </div>
                    <div className="relative">
                        <Ellipsis 
                            className="text-neutral-500 cursor-pointer hover:text-neutral-700" 
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowMenu(!showMenu);
                            }}
                        />
                        
                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute left-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-99 min-w-[150px]">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors hover:cursor-pointer"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    แชร์
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    {isDeleting ? "กำลังลบ..." : "ลบ"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-col flex-wrap gap-1">
                    <div className="flex flex-row gap-1">
                        {province && (
                            <Badge className="bg-green-100 text-green-800">
                                <Briefcase className="w-4 h-4 mr-1" /> {province}
                            </Badge>
                        )}
                        {people && (
                            <Badge className="bg-blue-100 text-blue-800">
                                <Users className="w-4 h-4 mr-1" /> {people} คน
                            </Badge>
                        )}
                        {budget && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                                <CircleDollarSign className="w-4 h-4 mr-1" /> {Number(budget).toLocaleString("th-TH")} บาท
                            </Badge>
                        )}
                    </div>
                        
                    {/* Categories */}
                    {category && category.length > 0 && (
                        <div className="flex flex-row gap-1">
                            {category.map((t, idx) => (
                                <Badge
                                    key={idx}
                                    variant="secondary"
                                    style={COLOR.tag ? { backgroundColor: COLOR.tag } : undefined}
                                >
                                    {t}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Description
                {shortDesc && shortDesc !== "-" && (
                    <p className="mt-1 text-sm text-neutral-600">{shortDesc}</p>
                )} */}
            </div>

            {/* Click outside to close menu */}
            {showMenu && (
                <div 
                    className="fixed inset-0 z-5" 
                    onClick={() => setShowMenu(false)}
                />
            )}
        </Card>
    );
}

/* ----------------------------- Main Page ----------------------------- */
export default function SavePlans() {
    // ตั้ง base URL ผ่าน .env (ถ้าใช้ Vite proxy ให้ปล่อยว่าง)
    const API_BASE = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:3000";
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
                const res = await fetch(`${API_BASE}${ENDPOINT}`, {
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

    // Handle plan deletion
    const handlePlanDelete = (deletedId) => {
        setPlans(prevPlans => prevPlans.filter(plan => plan._id !== deletedId && plan.id !== deletedId));
    };

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
                            id={plan._id || plan.id || idx}
                            key={plan._id || plan.id || idx}
                            title={`${plan.title || "แผนทริป"}`}
                            date={formatThaiRange(plan.startDate, plan.endDate)}
                            description={[
                                plan.source?.length ? `ออกเดินทางจาก: ${plan.source.join(", ")}` : null,
                                plan.destination ? `จุดหมาย: ${plan.destination}` : null,
                                Number.isFinite(Number(plan.budget))
                                    ? `งบประมาณ: ${Number(plan.budget).toLocaleString("th-TH")} บาท`
                                    : null,
                            ]
                                .filter(Boolean)
                                .join(" • ")}
                            
                            budget={plan.budget}
                            province={plan.where}
                            people={plan.people}
                            category={plan.category}
                            onDelete={handlePlanDelete}
                        />
                    ))}
                </main>
            )}
        </div>
    );
}