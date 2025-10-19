import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";
import { href, useNavigate } from "react-router-dom";
import { MockLocations } from "../../mock/MockLocations.jsx";

export default function StartPoint({ value, onChange }) {
    const [mode, setMode] = useState(value?.type || "current"); // "current" | "hotel"
    const hotels = (MockLocations || []).filter(l => (l.category === "ที่พัก") || /โรงแรม/i.test(l?.name));
    const [hotelId, setHotelId] = useState(
        value?.type === "hotel" ? value?.refId : (hotels[0]?.id || "")
    );

    useEffect(() => {
        // init ครั้งแรก: ถ้ามี value มาก่อน sync state
        if (value?.type === "hotel" && value?.refId) setHotelId(value.refId);
    }, [value?.type, value?.refId]);

    const commitCurrent = () => {
        if (!navigator.geolocation) {
            onChange?.({
                type: "current",
                id: "start",
                name: "จุดเริ่มต้น (ตำแหน่งปัจจุบัน)",
                position: [13.7563, 100.5018], // fallback: กรุงเทพฯ
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
                    position: [13.7563, 100.5018],
                    order: 0,
                    isStart: true
                });
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    const commitHotel = (id) => {
        const h = hotels.find(x => x.id === id);
        if (!h || !Array.isArray(h.source)) return;
        onChange?.({
            type: "hotel",
            id: "start",
            refId: h.id,
            name: `จุดเริ่มต้น (โรงแรม: ${h.name})`,
            position: h.source, // [lat, lng]
            order: 0,
            isStart: true
        });
    };

    useEffect(() => {
        // auto commit เมื่อสลับโหมด
        if (mode === "current") commitCurrent();
        if (mode === "hotel" && hotelId) commitHotel(hotelId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

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
                            onChange={() => setMode("current")}
                        />
                        ตำแหน่งปัจจุบัน
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="start-mode"
                            checked={mode === "hotel"}
                            onChange={() => setMode("hotel")}
                        />
                        โรงแรม
                    </label>
                </div>
            </div>

            {mode === "hotel" && (
                <div className="mt-3 flex items-center gap-3">
                    <select
                        className="px-3 py-2 border border-neutral-300 rounded-md"
                        value={hotelId}
                        onChange={(e) => {
                            const id = e.target.value;
                            setHotelId(id);
                            commitHotel(id);
                        }}
                    >
                        {hotels.map(h => (
                            <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* {mode === "current" && (
                <div className="mt-3">
                    <button
                        type="button"
                        onClick={commitCurrent}
                        className="px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-50"
                    >
                        ใช้ตำแหน่งปัจจุบันอีกครั้ง
                    </button>
                </div>
            )} */}
        </>
    );
}