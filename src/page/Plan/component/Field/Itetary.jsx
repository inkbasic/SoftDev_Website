import { CalendarDays } from "lucide-react";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { DateRange } from "react-date-range";
import DateContainer from "./DateList";

const Itinerary = forwardRef(({ planData, isEditing, onDataChange }, ref) => {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef(null);
    const dayRefs = useRef({});

    // ใช้ planData โดยตรง แทนการ copy ไป local state
    const [range, setRange] = useState(() => ({
        startDate: planData?.startDate ? new Date(planData.startDate) : null,
        endDate: planData?.endDate ? new Date(planData.endDate) : null,
        key: "selection",
    }));

    // อัพเดท range เมื่อ planData เปลี่ยน (เฉพาะครั้งแรก)
    useEffect(() => {
        if (planData?.startDate && planData?.endDate) {
            setRange(prev => {
                const newStart = new Date(planData.startDate);
                const newEnd = new Date(planData.endDate);
                
                // เช็คว่าเปลี่ยนแปลงจริงหรือไม่
                if (!prev.startDate || !prev.endDate || 
                    prev.startDate.getTime() !== newStart.getTime() || 
                    prev.endDate.getTime() !== newEnd.getTime()) {
                    return {
                        startDate: newStart,
                        endDate: newEnd,
                        key: "selection"
                    };
                }
                return prev;
            });
        }
    }, [planData?.startDate, planData?.endDate]);

    // สร้างรายการวันที่จาก range
    const generateDateList = () => {
        if (!range.startDate || !range.endDate) return [];
        
        const dates = [];
        const currentDate = new Date(range.startDate);
        const endDate = new Date(range.endDate);
        
        while (currentDate <= endDate) {
            const dateKey = currentDate.toISOString().split('T')[0];
            const dayName = currentDate.toLocaleDateString('th-TH', { weekday: 'long' });
            const dateStr = currentDate.toLocaleDateString('th-TH', { 
                day: 'numeric', 
                month: 'long' 
            });
            
            dates.push({
                key: dateKey,
                dayName: dayName,
                date: dateStr,
                fullTitle: `${dayName}, ${dateStr}`,
                sidebarFormat: `${dayName} ${currentDate.getDate()}/${currentDate.getMonth() + 1}`,
                data: planData?.itinerary?.[dateKey] || {
                    dayName,
                    date: dateStr,
                    description: "วันว่าง",
                    locations: [],
                    travelTimes: []
                }
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    };

    const dateList = generateDateList();

    useImperativeHandle(ref, () => ({
        scrollToDate: (dateString) => {
            const targetDate = dateList.find(date => date.sidebarFormat === dateString);
            
            if (targetDate && dayRefs.current[targetDate.key]) {
                dayRefs.current[targetDate.key].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        },
        getDateList: () => dateList.map(date => date.sidebarFormat)
    }));

    // ส่งข้อมูลกลับเมื่อ range เปลี่ยนจาก user interaction เท่านั้น
    const handleRangeChangeComplete = (newRange) => {
        if (onDataChange && newRange.startDate && newRange.endDate) {
            const updatedData = {
                ...planData,
                startDate: newRange.startDate.toISOString().split('T')[0],
                endDate: newRange.endDate.toISOString().split('T')[0]
            };
            onDataChange(updatedData);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowPicker(false);
            }
        };

        if (showPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPicker]);

    const safeRange = {
        startDate: range.startDate || new Date(),
        endDate: range.endDate || range.startDate || new Date(),
        key: "selection",
    };

    const handleRangeChange = ({ selection }) => {
        const newRange = { ...selection };
        
        setRange(prev => {
            if (selection.startDate !== selection.endDate) {
                const result = { startDate: selection.startDate, endDate: selection.endDate, key: "selection" };
                // ส่งข้อมูลกลับเมื่อเลือกเสร็จ
                setTimeout(() => handleRangeChangeComplete(result), 0);
                return result;
            }

            if (!prev.startDate && !prev.endDate) {
                return { startDate: selection.startDate, endDate: null, key: "selection" };
            }
            if (prev.startDate && !prev.endDate) {
                let start = selection.startDate;
                let end = selection.endDate;
                if (end < start) [start, end] = [end, start];
                const result = { startDate: prev.startDate, endDate: end, key: "selection" };
                // ส่งข้อมูลกลับเมื่อเลือกเสร็จ
                setTimeout(() => handleRangeChangeComplete(result), 0);
                return result;
            }

            return { startDate: selection.startDate, endDate: null, key: "selection" };
        });
    };

    const formatDate = (date) =>
        date ? date.toLocaleDateString("th-TH", { day: "numeric", month: "numeric" }) : "";

    return (
        <div className="flex flex-col w-full gap-5">
            <div className="flex items-center justify-between w-full">
                <h3>แผนการท่องเที่ยว</h3>
                <div className="flex gap-3">
                    <div
                        className={`relative flex items-center justify-between w-full gap-3 px-3 py-2 border ${
                            isEditing ? 'cursor-pointer' : 'cursor-default'
                        } bg-neutral-100 border-neutral-200 rounded-xl`}
                        onClick={() => isEditing && setShowPicker(true)}
                        ref={pickerRef}
                    >
                        <CalendarDays className="w-5 h-5" />
                        <div>
                            <span className="text-base font-bold text-gray-700">
                                {formatDate(range.startDate)}-
                            </span>
                            <span className="text-base font-bold text-gray-700">
                                {formatDate(range.endDate)}
                            </span>
                        </div>
                        {showPicker && (
                            <div className="absolute right-0 top-[100%] z-50">
                                <DateRange
                                    editableDateInputs={true}
                                    moveRangeOnFirstSelection={false}
                                    minDate={new Date()}
                                    ranges={[safeRange]}
                                    onChange={handleRangeChange}
                                    months={2}
                                    direction="horizontal"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* แสดงวันที่แบบ dynamic */}
            {dateList.map((dateInfo) => (
                <div 
                    key={dateInfo.key} 
                    ref={(el) => dayRefs.current[dateInfo.key] = el}
                >
                    <DateContainer 
                        title={dateInfo.fullTitle}
                        dayData={dateInfo.data}
                        isEditing={isEditing}
                    />
                </div>
            ))}
        </div>
    );
});

Itinerary.displayName = 'Itinerary';

export default Itinerary;