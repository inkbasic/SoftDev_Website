import { useState, useEffect } from "react";
import { getTravelBetween } from "@/lib/routeService";
import { MockLocations } from "../../mock/MockLocations.jsx";
import AddLocationPanel from "./AddLocationPanel.jsx";
import Pool from "/img/pool.jpg";

const image = Pool;
export default function StartPoint({ value, onChange, firstLocation, onRouteComputed }) {
    const [mode, setMode] = useState(value?.type || "current");
    const hotels = (MockLocations || []).filter(l => (l.category === "ที่พัก") || /โรงแรม/i.test(l?.name));
    const [hotelId, setHotelId] = useState(
        value?.type === "hotel" ? value?.refId : null
    );
    const [hotelName, setHotelName] = useState("");
    const [hotelDescription, setHotelDescription] = useState("");

    const [travel, setTravel] = useState(null); // { distanceKm, durationMin, coords }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (value?.type === "hotel" && value?.refId) setHotelId(value.refId);
    }, [value?.type, value?.refId]);

    const commitCurrent = () => {
        if (!navigator.geolocation) {
            onChange?.({
                type: "current",
                id: "start",
                name: "จุดเริ่มต้น (ตำแหน่งปัจจุบัน)",
                source: [13.7563, 100.5018],
                position: [13.7563, 100.5018],
                order: 0,
                isStart: true
            });
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                onChange?.({
                    type: "current",
                    id: "start",
                    name: "จุดเริ่มต้น (ตำแหน่งปัจจุบัน)",
                    source: [pos.coords.latitude, pos.coords.longitude],
                    position: [pos.coords.latitude, pos.coords.longitude],
                    order: 0,
                    isStart: true
                });
            },
            () => {
                onChange?.({
                    type: "current",
                    id: "start",
                    name: "จุดเริ่มต้น (ตำแหน่งปัจจุบัน)",
                    source: [13.7563, 100.5018],
                    position: [13.7563, 100.5018],
                    order: 0,
                    isStart: true
                });
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    const commitHotelObj = (h) => {
        if (!h || !Array.isArray(h.source)) return;
        onChange?.({
            type: "hotel",
            id: "start",
            refId: h.id,
            name: `จุดเริ่มต้น (โรงแรม: ${h.name})`,
            source: h.source,
            position: h.source,
            order: 0,
            isStart: true
        });
        console.log(h);
        setHotelName(h.name || "");
        setHotelDescription(h.description || "");
    };

    const commitHotel = (id) => {
        const h = hotels.find(x => x.id === id);
        if (!h) return;
        commitHotelObj(h);
    };

    useEffect(() => {
        if (mode === "current") commitCurrent();
        if (mode === "hotel" && hotelId) {
            commitHotel(hotelId);
        }
        setTravel(null);
    }, [mode]);

    useEffect(() => {
        const abort = new AbortController();
        const compute = async () => {
            setError("");
            setTravel(null);
            if (!value || !firstLocation) return;
            setLoading(true);
            try {
                const res = await getTravelBetween(value, firstLocation, abort.signal);
                if (res) {
                    setTravel(res);
                    onRouteComputed?.(res);
                } else {
                    setError("ไม่พบเส้นทาง");
                }
            } catch {
                setError("คำนวณไม่สำเร็จ");
            } finally {
                setLoading(false);
            }
        };
        compute();
        return () => abort.abort();
    }, [value?.position, value?.latitude, value?.longitude, firstLocation?.id]);

    return (
        <>
            <div className="flex items-center justify-between w-full">
                <h3 >จุดเริ่มต้นการเดินทาง</h3>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="start-mode"
                            checked={mode === "current"}
                            className="cursor-pointer"
                            onChange={() => setMode("current")}
                        />
                        ตำแหน่งปัจจุบัน
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="start-mode"
                            checked={mode === "hotel"}
                            className="cursor-pointer"
                            onChange={() => setMode("hotel")}
                        />
                        โรงแรม
                    </label>
                </div>
            </div>

            {mode === "hotel" && (
                <div className="mt-3">
                    {hotelId && (
                    <div
                        className={`flex gap-2 h-40 w-full mb-5 bg-white relative location-card`}
                    >
                        <div className="flex flex-col gap-2 px-5 py-3 rounded-[8px] border border-neutral-200 w-full h-full relative">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-bold truncate">{hotelName}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-neutral-500 text-sm line-clamp-3">{hotelDescription}</p>
                        </div>

                        <div className="flex items-center w-76 h-full bg-neutral-200 rounded-[8px] justify-center overflow-hidden">
                            <img src={image} className="object-cover w-full h-full" />
                        </div>
                    </div>
                    )}
                    <AddLocationPanel
                        existing={[]}
                        placeholder="พิมพ์เพื่อค้นหาโรงแรม..."
                        filter={(arr) => arr.filter(x => (x.category === "ที่พัก") || /โรงแรม/i.test(x?.name))}
                        onAdd={(loc) => {
                            setHotelId(loc.id);
                            commitHotelObj(loc);
                        }}
                        onOpenChange={() => { }}
                    />
                </div>
            )}

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
                    <p className="text-neutral-500">โปรดเลือกโรงแรม</p>
                )}
            </div>
        </>
    );
}