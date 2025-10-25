import Card from "./Card";
import Info from "./Info";
import Car from "/Car.png";
import Itetary from "./Itetary";
import { CancelButton, SaveButton, MeatButton } from "./Button";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";
import { href, useNavigate } from "react-router-dom";
import { MockLocations } from "../../mock/MockLocations.jsx";
import StartPoint from "./StartPoint";

const Field = forwardRef(({ planData, onDataChange }, ref) => {
    const [isEditing, setIsEditing] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [data, setData] = useState(planData || {});

    const navigate = useNavigate();

    useEffect(() => {
        setData(planData);
    }, [planData]);

    // เพิ่ม callback สำหรับรับการเปลี่ยนแปลงจาก Itinerary
    const handleItineraryDataChange = (updatedData) => {
        setData(updatedData);
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

    const handleSave = () => {
        console.log("Saving data:", data);
        setIsEditing(false);
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

    const handleStartPointChange = (startPoint) => {
        const updated = { ...(data || {}), startPoint };
        setData(updated);
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
            className="h-full w-full flex flex-col gap-5 px-20 py-5 justify-start items-center bg-paper overflow-x-visible overflow-y-auto scroll-auto-hide"
            ref={fieldRef}
        >
            {/* Overview Section */}
            <div ref={overviewRef} className="w-full flex flex-col gap-1">
                <div className="flex justify-between items-center w-full">
                    <h3>{data.title}</h3>
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
                                        <p className="px-2 py-1 cursor-pointer hover:bg-neutral-200">แชร์</p>
                                        <p onClick={handleEdit} className="px-2 py-1 cursor-pointer hover:bg-neutral-200">แก้ไข</p>
                                        <p onClick={() => navigate("/")} className="px-2 py-1 cursor-pointer hover:bg-neutral-200">ลบ</p>
                                    </div>
                                )}
                            </MeatButton>
                        )}
                    </div>
                </div>
                <p className="text-neutral-500">แก้ไขล่าสุด : {data.lastModified}</p>
            </div>

            <Card>
                <Info data={data} />
            </Card>

            {/* Car Section */}
            <div ref={carRef} className="w-full flex justify-center items-center gap-3 py-2 cursor-pointer" onClick={() => window.open("https://thairentacar.com/", "_blank")}>
                <div className="w-full flex flex-col gap-2">
                    <div className="relative w-full h-fit rounded-[8px] overflow-hidden">
                        <img src={Car} className="object-cover w-full h-full" />
                    </div>
                </div>
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