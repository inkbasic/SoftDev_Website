"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { data, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { StatCard } from "./components/StatCard";
import { AdTable } from "./components/AdTable";
import { Plus } from "lucide-react";

// กราฟยังคงใช้ mock ตามโจทย์
import { PaginationMock } from "./components/PaginationMock";
import { ChartAreaInteractive } from "@/components/Chart";
import { generateChartConfig } from "@/components/generateChartConfig";
import { generatePastData } from "./components/generatePastData";
import { chartTabs } from "./components/chartTabs";

const jsonData = {
    booking: 0,
    click: 0,
    contract: 0,
    ctr: 0,
    date: "2025-09-30",
    view: 0,
};

const mockData = generatePastData(jsonData, 20);

// ===== Utilities =====
const nfTH = new Intl.NumberFormat("th-TH");
const dtFmt = new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "short", year: "numeric" });
// const chartConfig = generateChartConfig(chartData);

const chartConfig = [
    { key: "click", label: "Click", color: "var(--chart-1)" },
    { key: "view", label: "View", color: "var(--chart-2)" },
    { key: "contract", label: "Contract", color: "var(--chart-3)" },
    { key: "booking", label: "Booking", color: "var(--chart-4)" },
    { key: "ctr", label: "CTR", color: "var(--chart-5)" },
];

/** ดึง JWT จาก storage (ถ้าไม่มีให้ fallback เป็นสตริงเฉย ๆ) */
function getAuthToken() {
    const fromLocal = localStorage.getItem("jwtToken");
    const fromSession = sessionStorage.getItem("jwtToken");
    return fromLocal || fromSession || "jwtToken";
}

/** map ข้อมูลแถวของ API /ad -> แถวของตาราง AdTable (โค้ดเดิม) */
function mapApiRowToAdTableRow(row) {
    const created = row?.createdAt ? new Date(row.createdAt) : null;
    const expire = row?.expireAt ? new Date(row.expireAt) : null;
    const statusPrefix = row?.status?.includes("กำลังทำงาน") ? "✅ " : row?.status?.includes("รอ") ? "⏳ " : "• ";
    return {
        id: row.id,
        place: row.placeName || "-",
        adStatus: `${statusPrefix}${row.status || "-"}`,
        dateRange: created && expire ? `${dtFmt.format(created)} - ${dtFmt.format(expire)}` : "-",
        budget: typeof row.price === "number" ? `฿${nfTH.format(row.price)}` : "-",
    };
}

/** timeout helper: ตัดคำขอถ้าช้ากว่า ms ที่กำหนด ด้วย AbortController แยกต่างหาก */
function fetchWithTimeout(input, init = {}, ms = 15000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    const merged = { ...init, signal: controller.signal };
    return fetch(input, merged).finally(() => clearTimeout(timer));
}

/** parse JSON แบบปลอดภัย + preview ข้อความเมื่อไม่ใช่ JSON */
async function parseJsonResponse(res) {
    if (res.status === 204) return null;
    const ct = res.headers.get("content-type") || "";
    const raw = await res.text();
    if (!raw || !raw.trim()) return null;
    if (ct.includes("application/json") || /^\s*[{[]/.test(raw)) {
        try {
            return JSON.parse(raw);
        } catch (e) {
            const preview = raw.slice(0, 200);
            throw new Error(`JSON parse error: ${e.message}. Preview: ${preview}`);
        }
    }
    const preview = raw.slice(0, 200).replace(/\s+/g, " ");
    throw new Error(`Expected JSON but received ${ct || "unknown content-type"}. Preview: ${preview}`);
}

export default function Dashboard() {
    const navigate = useNavigate();

    // ===== State (เดิม) =====
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [totals, setTotals] = useState({
        views: 0,
        clicks: 0,
        contacts: 0,
        bookings: 0,
        ctr: 0,
    });

    const [table, setTable] = useState([]);
    const [graph, setGraph] = useState([]); // เก็บไว้เฉย ๆ ตามโจทย์

    const [chartData, setChartData] = useState([]);
    const [chartVersion, setChartVersion] = useState(0);

    // ===== State (ใหม่สำหรับ /places — เก็บไว้เฉย ๆ) =====
    /** โครงสร้างข้อมูลอ้างอิง:
     * [
     *   {
     *     "_id":"68dbaa46f889887f69097d49",
     *     "name":"ไก่ย่าง 5 ดาว สาขา ฉลองกรุง1",
     *     "location":[0,0],
     *     "description":"string",
     *     "providerId":"68db9fb67e7c55fe6d6ec0a8",
     *     "tags":["budget"],
     *     "type":"Restaurant",
     *     "openingHours":"1970-01-01T02:00:00.000Z",
     *     "closingHours":"1970-01-01T13:00:00.000Z",
     *     "cuisineType":"Street Food",
     *     "contactInfo":"https://fivestar.in.th"
     *   }
     * ]
     */
    const [places, setPlaces] = useState([]); // ✅ เก็บข้อมูล /places
    const [placesLoading, setPlacesLoading] = useState(false); // ✅ สถานะโหลด /places
    const [placesError, setPlacesError] = useState(""); // ✅ เก็บ error /places (ไม่แสดงผล)

    // ===== StrictMode & safety refs =====
    const didRunRef = useRef(false); // กัน double-run ใน React 18 StrictMode dev สำหรับ /ad
    const didRunPlacesRef = useRef(false); // กัน double-run สำหรับ /places
    const isMountedRef = useRef(true); // ป้องกัน setState หลัง unmount

    useEffect(() => {
        console.log("chartData changed:", chartData);
        console.table(chartData);
        setChartVersion((v) => v + 1); // บังคับ remount chart เมื่อข้อมูลเปลี่ยน
    }, [chartData]);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // ===== ดึงข้อมูล /ad (ของเดิม) =====
    useEffect(() => {
        // กัน double fetch ใน dev (StrictMode)
        if (didRunRef.current) return;
        didRunRef.current = true;

        const token = getAuthToken();
        if (!token || token === "undefined") {
            navigate("/login", { replace: true });
            return;
        }

        // controller เฉพาะสำหรับ unmount; ส่วน timeout ใช้ controller ภายใน fetchWithTimeout
        const unmountController = new AbortController();

        (async () => {
            setLoading(true);
            setError("");

            try {
                const res = await fetchWithTimeout(
                    "/ad",
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        signal: unmountController.signal,
                    },
                    15000 // 15s
                );

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem("jwtToken");
                    sessionStorage.removeItem("jwtToken");
                    if (isMountedRef.current) {
                        setError("เซสชันหมดอายุหรือสิทธิ์ไม่เพียงพอ (ต้องเข้าสู่ระบบใหม่)");
                    }
                    navigate("/login", { replace: true });
                    return;
                }

                if (!res.ok) {
                    const t = await res.text().catch(() => "");
                    throw new Error(`Request failed ${res.status}: ${t?.slice(0, 200) || "(no response body)"}`);
                }

                const json = await parseJsonResponse(res);
                const data = json?.data ?? {};
                const apiTotals = data?.stats?.total || {};
                const apiGraph = data?.graph || [];
                const apiTable = data?.table || [];

                if (!isMountedRef.current) return;

                setTotals({
                    views: Number(apiTotals.views || 0),
                    clicks: Number(apiTotals.clicks || 0),
                    contacts: Number(apiTotals.contacts || 0),
                    bookings: Number(apiTotals.bookings || 0),
                    ctr: Number(apiTotals.ctr || 0),
                });
                setGraph(apiGraph); // เก็บไว้ ไม่ใช้งานต่อ
                setTable(apiTable);

                setChartData(generatePastData(apiGraph, 20));
            } catch (err) {
                if (err?.name === "AbortError" || err?.message?.includes("The operation was aborted")) {
                    return; // unmount/timeout — เงียบ ๆ
                }
                if (!isMountedRef.current) return;
                setError(err?.message || "ไม่สามารถดึงข้อมูลได้");
            } finally {
                if (isMountedRef.current) setLoading(false);
            }
        })();

        // cleanup: ยกเลิกเมื่อคอมโพเนนต์ unmount
        return () => {
            unmountController.abort();
        };
    }, [navigate]);

    // ===== โหลดรายการสถานที่จาก /places (เก็บไว้เฉย ๆ ไม่แสดงผล/ไม่ console.log) =====
    useEffect(() => {
        if (didRunPlacesRef.current) return;
        didRunPlacesRef.current = true;

        const token = getAuthToken();
        if (!token || token === "undefined") {
            // ถ้าไม่มี token ให้รีไดเรกต์เช่นเดียวกับ /ad
            navigate("/login", { replace: true });
            return;
        }

        const unmountController = new AbortController();

        (async () => {
            setPlacesLoading(true);
            setPlacesError("");

            try {
                const res = await fetchWithTimeout(
                    "/places", // === Required Inputs: api_endpoint ===
                    {
                        method: "GET", // === Required Inputs: api_method ===
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            // === Required Inputs: api_headers ===
                            Authorization: `Bearer ${token}`, // "Bearer jwtToken"
                        },
                        signal: unmountController.signal,
                    },
                    15000
                );

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem("jwtToken");
                    sessionStorage.removeItem("jwtToken");
                    if (isMountedRef.current) {
                        setPlacesError("เซสชันหมดอายุหรือสิทธิ์ไม่เพียงพอ (ต้องเข้าสู่ระบบใหม่)");
                    }
                    navigate("/login", { replace: true });
                    return;
                }

                if (!res.ok) {
                    const t = await res.text().catch(() => "");
                    throw new Error(`Request failed ${res.status}: ${t?.slice(0, 200) || "(no response body)"}`);
                }

                // โครงสร้างที่คาดหวัง: เป็น array ของ place objects
                const json = await parseJsonResponse(res);
                const arr = Array.isArray(json) ? json : json?.data ?? [];

                // ป้องกันกรณี API ตอบไม่ตรงสัญญา — ให้เซฟเฉพาะ object ที่มี _id และ name
                const safe = Array.isArray(arr) ? arr.filter((x) => x && typeof x === "object" && x._id && x.name) : [];

                if (!isMountedRef.current) return;
                setPlaces(safe); // ✅ เก็บไว้เฉย ๆ ตามคำสั่ง

                // debug
                console.log(safe);
            } catch (err) {
                if (err?.name === "AbortError" || err?.message?.includes("The operation was aborted")) {
                    return; // unmount/timeout — เงียบ ๆ
                }
                if (!isMountedRef.current) return;
                setPlacesError(err?.message || "โหลด /places ไม่สำเร็จ");
            } finally {
                if (isMountedRef.current) setPlacesLoading(false);
            }
        })();

        return () => unmountController.abort();
    }, [navigate]);

    // ===== แปลงข้อมูลของตารางโฆษณา (เดิม) =====
    const adTableData = useMemo(() => (Array.isArray(table) ? table.map(mapApiRowToAdTableRow) : []), [table]);

    // ===== ปุ่มนำทาง (เดิม) =====
    const handleAddLocation = () => navigate("/addlocation");
    const handleCreateAd = () => navigate("/create-ad");

    // ===== UI เดิม (คงไว้) — ไม่มีการแสดงผล places ตามคำสั่ง =====
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
                กำลังดึงข้อมูลแดชบอร์ด...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
                <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>
                <div className="max-w-xl text-xs text-muted-foreground">
                    เคล็ดลับดีบัก: ตรวจสอบ proxy/CORS, ตรวจว่า <code>/ad</code> ใช้ HTTPS/โดเมนเดียวกับเว็บหรือไม่, และ
                    API ตอบเป็น JSON พร้อม <code>Content-Type: application/json</code>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    ลองใหม่
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6 px-4 py-20">
            {/* Header */}
            <div className="flex items-center justify-between w-full max-w-5xl pb-4">
                <h2 className="text-2xl">Dashboard</h2>
            </div>

            {/* Stat Cards จาก API */}
            <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
                <StatCard
                    title="ยอดเข้าชมโฆษณา (Views)"
                    value={`${nfTH.format(totals.views)} ครั้ง`}
                    change={`+ ${nfTH.format(totals.ctr)}%`}
                    trend="แนวโน้มเพิ่มขึ้นในเดือนนี้"
                    description="รวมตั้งแต่เริ่มรันแคมเปญ"
                    isUp={true}
                />
                <StatCard
                    title="จำนวนการคลิก (Clicks)"
                    value={`${nfTH.format(totals.clicks)} คลิก`}
                    change={`+ ${nfTH.format(totals.ctr)}%`}
                    trend="แนวโน้มเพิ่มขึ้นในเดือนนี้"
                    description="รวมตั้งแต่เริ่มรันแคมเปญ"
                    isUp={totals.clicks >= 0}
                />
                <StatCard
                    title="การติดต่อ (Contacts)"
                    value={`${nfTH.format(totals.contacts)} ครั้ง`}
                    change={`+ ${nfTH.format(totals.ctr)}%`}
                    trend="แนวโน้มเพิ่มขึ้นในเดือนนี้"
                    description="รวมตั้งแต่เริ่มรันแคมเปญ"
                    isUp={totals.contacts >= 0}
                />
                <StatCard
                    title="ยอดจองผ่านโฆษณา (Bookings)"
                    value={`${nfTH.format(totals.bookings)} การจอง`}
                    change={`+ ${nfTH.format(totals.ctr)}%`}
                    trend="แนวโน้มเพิ่มขึ้นในเดือนนี้"
                    description="รวมตั้งแต่เริ่มรันแคมเปญ"
                    isUp={totals.bookings >= 0}
                />
            </div>

            {/* Chart */}
            <div className="flex flex-col w-full max-w-5xl gap-6 pt-20">
                <ChartAreaInteractive
                    title="แดชบอร์ดโฆษณา"
                    description="สถิติการแสดงผลและการคลิก"
                    chartData={mockData}
                    chartConfig={chartConfig}
                />
            </div>

            {/* Table ad */}
            <div className="flex flex-col w-full max-w-5xl gap-6 pt-20">
                <div className="flex justify-end w-full gap-3">
                    <Button variant="outline" onClick={handleAddLocation}>
                        <Plus />
                        เพิ่มสถานที่
                    </Button>
                    <Button variant="outline" onClick={handleCreateAd}>
                        <Plus />
                        ลงโฆษณา
                    </Button>
                </div>

                <AdTable
                    data={adTableData}
                    onDelete={(row) => {
                        /* เงียบไว้ตามคำสั่ง */
                    }}
                />
                <PaginationMock />
            </div>
        </div>
    );
}
