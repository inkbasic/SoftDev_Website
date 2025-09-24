import { useEffect, useRef } from "react";
import Field from "./component/Field/Field.jsx";
import Map from "./component/Map/Map.jsx";
import Side from "./component/Side/Side.jsx";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Plan() {
    const fieldRef = useRef(null);
    const { location, error, loading, getCurrentPosition } = useGeolocation();

    useEffect(() => {
        console.log("Current location:", location);
    }, [location]);

    const handleSidebarItemClick = (item) => {
        if (fieldRef.current && fieldRef.current.scrollToSection) {
            fieldRef.current.scrollToSection(item);
        }
    };

    // ส่ง location ไปยัง Map component
    return (
        <div className="w-full h-full flex justify-center">
            <div className="flex w-full">
                <Side onItemClick={handleSidebarItemClick} />
                <Field ref={fieldRef} />
            </div>

            <div className="w-full h-full flex items-center justify-center">
                {loading ? <h1 className="p-4">กำลังโหลด...</h1>
                    : <Map center={location ? [location.latitude, location.longitude] : [13.7563, 100.5018]} />}
                {error && (
                    <div className="p-4 text-red-500">
                        ไม่สามารถดึงตำแหน่งได้: {error}
                        <button
                            onClick={getCurrentPosition}
                            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                        >
                            ลองใหม่
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}