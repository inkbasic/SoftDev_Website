import Card from "./Card";
import Info from "./Info";
import BusinessCard from "./BusinessCard";
import Itetary from "./Itetary";
import { CancelButton, SaveButton, MeatButton } from "./Button";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";


const Field = forwardRef((props, ref) => {
    const [isEditing, setIsEditing] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [data, setData] = useState({
        title: "บางแสน...แสนสาหัส",
        lastModified: "25 สิงหาคม 2568",
        info: {},
        hotels: [],
        cars: [],
        itinerary: {}
    });

    const fieldRef = useRef(null);
    const menuRef = useRef(null);
    useAutoHideScrollbar(fieldRef);

    // เพิ่ม refs สำหรับแต่ละส่วน
    const overviewRef = useRef(null);
    const hotelRef = useRef(null);
    const carRef = useRef(null);
    const itineraryRef = useRef(null);

    // ฟังก์ชันสำหรับ scroll ไปยังส่วนต่างๆ
    const scrollToSection = (sectionName) => {
        let targetRef = null;

        switch (sectionName) {
            case 'ภาพรวม':
                targetRef = overviewRef;
                break;
            case 'ที่พัก':
                targetRef = hotelRef;
                break;
            case 'เช่ารถ':
                targetRef = carRef;
                break;
            case 'กำหนดการ':
                targetRef = itineraryRef;
                break;
            default:
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

    useImperativeHandle(ref, () => ({
        scrollToSection
    }));

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

    const updateData = (field, value) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div
            className="h-full w-full flex flex-col gap-5 px-20 py-5 justify-start items-center bg-paper overflow-x-clip scroll-auto-hide"
            ref={fieldRef}
        >
            {/* Overview Section */}
            <div ref={overviewRef} className="w-full flex flex-col gap-1">
                <div className="flex justify-between items-center w-full">
                    <h3>บางแสน...แสนสาหัส</h3>
                    <div className="flex gap-3 relative">
                        {isEditing ? (
                            <>
                                <CancelButton onClick={handleCancel} />
                                <SaveButton onClick={handleSave} />
                            </>
                        ) : (
                            <MeatButton onClick={handleToggleMenu} click={showMenu}>
                                {showMenu && (
                                <div ref={menuRef} className="absolute right-0 top-full mt-1 w-30 bg-white border border-neutral-200 rounded-md shadow-lg z-10 overflow-hidden z-50">
                                    <p className="px-2 py-1 cursor-pointer hover:bg-neutral-200">แชร์</p>
                                    <p onClick={handleEdit} className="px-2 py-1 cursor-pointer hover:bg-neutral-200">แก้ไข</p>
                                    <p className="px-2 py-1 cursor-pointer hover:bg-neutral-200">ลบ</p>
                                </div>
                                )}
                            </MeatButton>
                        )}
                    </div>
                </div>
                <p className="text-neutral-500">แก้ไขล่าสุด : 25 สิงหาคม 2568</p>
            </div>

            <Card>
                <Info />
            </Card>

            {/* Hotel Section */}
            <Card ref={hotelRef}>
                <p className="font-bold">โรงแรม</p>
                <div className="w-full flex justify-center items-center gap-3 py-2">
                    <BusinessCard showStar={true} />
                    <BusinessCard showStar={true} />
                    <BusinessCard showStar={true} />
                </div>
                <div className="btnBackground w-full text-center text-paper font-bold px-4 py-2 rounded-[8px]">
                    <p>ดูเพิ่มเติม</p>
                </div>
            </Card>

            {/* Car Section */}
            <Card ref={carRef}>
                <p className="font-bold">รถเช่า</p>
                <div className="w-full flex justify-center items-center gap-3 py-2">
                    <BusinessCard showStar={false} />
                    <BusinessCard showStar={false} />
                    <BusinessCard showStar={false} />
                </div>
                <div className="btnBackground w-full text-center text-paper font-bold px-4 py-2 rounded-[8px]">
                    <p>ดูเพิ่มเติม</p>
                </div>
            </Card>

            {/* Itinerary Section */}
            <div ref={itineraryRef}>
                <Itetary />
            </div>
        </div>
    );
});

Field.displayName = 'Field';

export default Field;