import { useRef, useState, useEffect } from "react";
import Field from "./component/Field/Field.jsx";
import Map from "./component/Map/Map.jsx";
import Side from "./component/Side/Side.jsx";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocation } from "react-router-dom";
import { PlanMock } from "./mock/Mock.jsx";

export default function Plan() {
    const location = useLocation();
    const fieldRef = useRef(null);
    const { location: geoLocation, error, loading, getCurrentPosition } = useGeolocation();

    const initialData = PlanMock;
    const isNewPlan = location.state?.isNew || false;

    useEffect(() => {
        if (isNewPlan) {
            console.log("New plan created with data:", initialData);

        }
    }, [isNewPlan, initialData]);
    
    const [currentData, setCurrentData] = useState(initialData);

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
                />
            </div>

            <div className="w-full h-full flex items-center justify-center">
                {loading ? <h1 className="p-4">กำลังโหลด...</h1>
                    : <Map center={geoLocation ? [geoLocation.latitude, geoLocation.longitude] : [13.7563, 100.5018]} />}
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