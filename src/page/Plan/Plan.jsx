import { useRef, useState, useEffect, useMemo } from "react";
import Field from "./component/Field/Field.jsx";
import MapView from "./component/Map/Map.jsx";
import Side from "./component/Side/Side.jsx";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocation } from "react-router-dom";
import { PlanMock } from "./mock/Mock.jsx";
import { MockLocations } from "./mock/MockLocations.jsx";
import { EyeIcon } from "lucide-react";

export default function Plan() {
    const location = useLocation();
    const fieldRef = useRef(null);
    const { location: geoLocation, error, loading, getCurrentPosition } = useGeolocation();

    const [isHideMap, setIsHideMap] = useState(false);

    const initialData = PlanMock;
    const isNewPlan = location.state?.isNew || false;

    // ย้ายประกาศ state ขึ้นมาก่อนใช้
    const [currentData, setCurrentData] = useState(initialData);

    const startMarker = useMemo(() => {
        const sp = currentData?.startPoint;
        if (!sp?.position) return null;
        return { ...sp, isStart: true, order: 0 };
    }, [currentData?.startPoint]);

    useEffect(() => {
        if (isNewPlan) {
            console.log("New plan created with data:", initialData);
        }
    }, [isNewPlan, initialData]);

    const markers = useMemo(() => {
        const out = [];
        const seen = new Set();
        const idToSource = new globalThis.Map(MockLocations.map(m => [m.id, m.source]));
        const iti = currentData?.itinerary || {};
        Object.values(iti).forEach(day => {
            (day?.locations || []).forEach((loc, idx) => {
                const pos = loc.source || idToSource.get(loc.id);
                if (!Array.isArray(pos)) return;
                // ใช้ครั้งแรกที่พบ เพื่อไม่ซ้ำ
                if (seen.has(`${loc.id}`)) return;
                seen.add(`${loc.id}`);
                out.push({
                    id: loc.id,
                    name: loc.name,
                    position: pos,
                    order: loc.order ?? (idx + 1) // ส่ง order ไปให้ Map
                });
            });
        });
        return out;
    }, [currentData?.itinerary]);

    const handleSidebarItemClick = (item) => {
        if (fieldRef.current && fieldRef.current.scrollToSection) {
            fieldRef.current.scrollToSection(item);
        }
    };

    // รับการเปลี่ยนแปลงจาก Field โดยตรง
    const handleDataChange = (updatedData) => {
        setCurrentData(updatedData);
    };

    return (
        <div className="w-full h-full flex justify-center">
            <div className="flex w-full">
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
                />
            </div>

            <div className={`w-full h-full flex items-center justify-center ` + (isHideMap ? 'hidden' : '')}>
                {loading ? (
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