import { CalendarDays } from "lucide-react";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { DateRange } from "react-date-range";
import DateContainer from "./DateContainer";
import Location from "./Location";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';

const toLocalYMD = (date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const parseYMD = (str) => {
    if (!str) return null;
    const [y, m, d] = str.split("-").map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1); // local midnight
    dt.setHours(0, 0, 0, 0);
    return dt;
};

const normalizeOrders = (itinerary) => {
    const out = {};
    const keys = Object.keys(itinerary || {}).sort(); // YYYY-MM-DD
    keys.forEach(k => {
        const day = itinerary[k] || {};
        const list = Array.isArray(day.locations) ? day.locations : [];
        // กำหนดเลขลำดับภายในแต่ละวัน (1..N) ตามตำแหน่งใน array
        const newLocs = list.map((l, i) => ({ ...l, order: i + 1 }));
        out[k] = { ...day, locations: newLocs };
    });
    return out;
};

const Itinerary = forwardRef(({ planData, isEditing, onDataChange }, ref) => {
    const [showPicker, setShowPicker] = useState(false);
    const [pendingRange, setPendingRange] = useState(null);
    const pickerRef = useRef(null);
    const dayRefs = useRef({});

    const [range, setRange] = useState(() => ({
        startDate: parseYMD(planData?.startDate) || null,
        endDate: parseYMD(planData?.endDate) || null,
        key: "selection",
    }));

    useEffect(() => {
        if (planData?.startDate && planData?.endDate) {
            setRange(prev => {
                const newStart = parseYMD(planData.startDate);
                const newEnd = parseYMD(planData.endDate);
                if (!prev.startDate || !prev.endDate ||
                    prev.startDate.getTime() !== newStart.getTime() ||
                    prev.endDate.getTime() !== newEnd.getTime()) {
                    return { startDate: newStart, endDate: newEnd, key: "selection" };
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
        currentDate.setHours(0, 0, 0, 0);
        const endDate = new Date(range.endDate);
        endDate.setHours(0, 0, 0, 0);

        while (currentDate <= endDate) {
            const dateKey = toLocalYMD(currentDate); // ใช้ local key
            const dayName = currentDate.toLocaleDateString('th-TH', { weekday: 'long' });
            const dateStr = currentDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'long' });

            dates.push({
                key: dateKey,
                dayName,
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

    // helper: สร้าง meta สำหรับช่วงวันที่
    const buildDateMeta = (startDateObj, endDateObj) => {
        if (!startDateObj || !endDateObj) return [];
        const out = [];
        const cur = new Date(startDateObj);
        cur.setHours(0, 0, 0, 0);
        const end = new Date(endDateObj);
        end.setHours(0, 0, 0, 0);
        while (cur <= end) {
            const key = toLocalYMD(cur);
            const dayName = cur.toLocaleDateString('th-TH', { weekday: 'long' });
            const dateStr = cur.toLocaleDateString('th-TH', { day: 'numeric', month: 'long' });
            out.push({ key, dayName, dateStr, dateObj: new Date(cur) });
            cur.setDate(cur.getDate() + 1);
        }
        return out;
    };

    // helper: ถ้าไม่มีช่วงวันที่เดิม ให้เรียงจาก keys เดิมแทน
    const buildDateMetaFromKeys = (keys) => {
        const out = [];
        (keys || []).sort().forEach(k => {
            const d = parseYMD(k);
            if (!d) return;
            const dayName = d.toLocaleDateString('th-TH', { weekday: 'long' });
            const dateStr = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long' });
            out.push({ key: k, dayName, dateStr, dateObj: d });
        });
        return out;
    };

    // เมื่อช่วงวันที่เปลี่ยน: อัปเดต start/end และ re-map itinerary ให้สอดคล้องกับลำดับวันใหม่
    const handleRangeChangeComplete = (newRange) => {
        if (!onDataChange || !newRange.startDate || !newRange.endDate) return;

        const newStartYMD = toLocalYMD(newRange.startDate);
        const newEndYMD = toLocalYMD(newRange.endDate);

        // meta เดิมตามช่วงวันที่เดิม ถ้าไม่มีให้ fallback จาก keys ที่มีอยู่
        let oldMeta = [];
        if (planData?.startDate && planData?.endDate) {
            oldMeta = buildDateMeta(parseYMD(planData.startDate), parseYMD(planData.endDate));
        }
        if (!oldMeta.length) {
            oldMeta = buildDateMetaFromKeys(Object.keys(planData?.itinerary || {}));
        }

        // meta ใหม่ตามช่วงวันที่ใหม่
        const newMeta = buildDateMeta(newRange.startDate, newRange.endDate);

        // รวบรวมข้อมูลวันเดิมตามลำดับ (locations/travelTimes/description จะคงไว้, แต่ dayName/date จะปรับใหม่)
        const oldDaysData = oldMeta.map(m => (planData?.itinerary?.[m.key]) || {
            description: 'วันว่าง',
            locations: [],
            travelTimes: [],
        });

        const newItinerary = {};
        const minLen = Math.min(oldDaysData.length, newMeta.length);
        for (let i = 0; i < minLen; i++) {
            const src = oldDaysData[i] || {};
            const tgt = newMeta[i];
            newItinerary[tgt.key] = {
                ...src,
                dayName: tgt.dayName,
                date: tgt.dateStr,
            };
        }
        // ถ้ามีวันใหม่ยาวกว่าเดิม เติมว่างให้ครบ
        for (let i = minLen; i < newMeta.length; i++) {
            const tgt = newMeta[i];
            newItinerary[tgt.key] = {
                dayName: tgt.dayName,
                date: tgt.dateStr,
                description: 'วันว่าง',
                locations: [],
                travelTimes: [],
            };
        }

        const normalized = normalizeOrders(newItinerary);
        const updatedData = {
            ...planData,
            startDate: newStartYMD,
            endDate: newEndYMD,
            itinerary: normalized,
        };
        onDataChange(updatedData);
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
                // ตั้ง pending เพื่อ commit หลัง render แทนการอัปเดต parent ระหว่าง render
                setPendingRange(result);
                setShowPicker(false);
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
                // ตั้ง pending เพื่อ commit หลัง render แทนการอัปเดต parent ระหว่าง render
                setPendingRange(result);
                setShowPicker(false);
                return result;
            }

            return { startDate: selection.startDate, endDate: null, key: "selection" };
        });
    };

    // Commit ช่วงวันที่หลัง render เสร็จ เพื่อลด warning update ขณะ render
    useEffect(() => {
        if (pendingRange && pendingRange.startDate && pendingRange.endDate) {
            handleRangeChangeComplete(pendingRange);
            setPendingRange(null);
        }
    }, [pendingRange]);

    const handleLocationUpdate = (dateKey, updatedLocations) => {
        const updatedItinerary = {
            ...planData.itinerary,
            [dateKey]: {
                ...planData.itinerary[dateKey],
                locations: updatedLocations
            }
        };
        const normalized = normalizeOrders(updatedItinerary);
        const updatedData = { ...planData, itinerary: normalized };
        onDataChange?.(updatedData);
    };

    // ถ้าข้อมูลจากภายนอกเข้ามาแล้ว order ไม่ต่อกัน ให้ normalize หนึ่งครั้ง
    useEffect(() => {
        if (!planData?.itinerary) return;
        const normalized = normalizeOrders(planData.itinerary);
        // เช็คว่ามีความต่างไหมก่อนยิง onDataChange
        const same =
            JSON.stringify(planData.itinerary) === JSON.stringify(normalized);
        if (!same) onDataChange?.({ ...planData, itinerary: normalized });
    }, [planData?.itinerary]);

    const formatDate = (date) =>
        date ? date.toLocaleDateString("th-TH", { day: "numeric", month: "numeric" }) : "";

    const [activeId, setActiveId] = useState(null);
    const [draggedLocation, setDraggedLocation] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // สร้าง flat list ของ locations ทั้งหมดสำหรับ SortableContext
    const getAllLocations = () => {
        const allLocations = [];
        dateList.forEach(dateInfo => {
            if (dateInfo.data.locations) {
                dateInfo.data.locations.forEach(location => {
                    allLocations.push({
                        ...location,
                        dateKey: dateInfo.key
                    });
                });
            }
        });
        return allLocations;
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);

        // หา location ที่กำลังลาก
        const allLocations = getAllLocations();
        const draggedLoc = allLocations.find(loc => loc.id === active.id);
        setDraggedLocation(draggedLoc);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        setDraggedLocation(null);

        if (!over) return;

        const activeLocationId = active.id;

        // หาว่า location ที่ลากมาจากวันไหน
        let sourceDate = null;
        let sourceIndex = -1;

        dateList.forEach(dateInfo => {
            const locationIndex = dateInfo.data.locations?.findIndex(loc => loc.id === activeLocationId);
            if (locationIndex !== -1) {
                sourceDate = dateInfo.key;
                sourceIndex = locationIndex;
            }
        });

        if (sourceDate === null) return;

        // ตรวจสอบว่าลากไปที่ไหน
        const overId = over.id;

        // ถ้าลากไปที่ location อื่น
        if (overId !== activeLocationId) {
            let targetDate = null;
            let targetIndex = -1;

            // หา target location
            dateList.forEach(dateInfo => {
                const locationIndex = dateInfo.data.locations?.findIndex(loc => loc.id === overId);
                if (locationIndex !== -1) {
                    targetDate = dateInfo.key;
                    targetIndex = locationIndex;
                }
            });

            // หา drop zone
            if (targetDate === null) {
                // ลองหา drop zone
                dateList.forEach(dateInfo => {
                    if (overId === `drop-zone-${dateInfo.key}`) {
                        targetDate = dateInfo.key;
                        targetIndex = dateInfo.data.locations?.length || 0;
                    }
                });
            }

            if (targetDate !== null) {
                // ถ้าย้ายข้ามวัน บังคับให้ไปท้ายวันเสมอ เพื่อป้องกันการสลับตำแหน่งกับปลายทาง
                if (targetDate !== sourceDate) {
                    const endIndex = (planData?.itinerary?.[targetDate]?.locations?.length) || 0;
                    moveLocationBetweenDates(sourceDate, sourceIndex, targetDate, endIndex, activeLocationId);
                } else {
                    moveLocationBetweenDates(sourceDate, sourceIndex, targetDate, targetIndex, activeLocationId);
                }
            }
        }
    };

    const moveLocationBetweenDates = (sourceDate, sourceIndex, targetDate, targetIndex, locationId) => {
        const currentItinerary = { ...planData.itinerary };

        if (sourceDate === targetDate) {
            // ย้ายภายในวันเดียวกัน - ใช้ arrayMove
            const sourceLocations = [...(currentItinerary[sourceDate]?.locations || [])];
            const reorderedLocations = arrayMove(sourceLocations, sourceIndex, targetIndex);

            const updatedItinerary = {
                ...currentItinerary,
                [sourceDate]: {
                    ...currentItinerary[sourceDate],
                    locations: reorderedLocations
                }
            };

            const normalized = normalizeOrders(updatedItinerary);
            const updatedData = { ...planData, itinerary: normalized };
            onDataChange?.(updatedData);
        } else {
            // ย้ายข้ามวัน: บังคับไปท้ายรายการเสมอ (ไม่ใช้ targetIndex)
            const sourceLocations = [...(currentItinerary[sourceDate]?.locations || [])];
            const [movedLocation] = sourceLocations.splice(sourceIndex, 1);

            const targetLocations = [...(currentItinerary[targetDate]?.locations || [])];
            // ใส่ไว้ท้ายสุด
            targetLocations.push(movedLocation);

            const updatedItinerary = {
                ...currentItinerary,
                [sourceDate]: {
                    ...currentItinerary[sourceDate],
                    locations: sourceLocations
                },
                [targetDate]: {
                    ...currentItinerary[targetDate],
                    locations: targetLocations
                }
            };

            const normalized = normalizeOrders(updatedItinerary);
            const updatedData = { ...planData, itinerary: normalized };
            onDataChange?.(updatedData);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col w-full gap-5">
                <div className="flex items-center justify-between w-full">
                    <h3>แผนการท่องเที่ยว</h3>
                    <div className="flex gap-3">
                        <div
                            className={`relative flex items-center justify-between w-full gap-3 px-3 py-2 border ${isEditing ? 'cursor-pointer' : 'cursor-default'
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

                {/* คำนวณ offset ของลำดับแบบต่อเนื่องข้ามวัน */}
                {(() => {
                    const offsets = {};
                    let acc = 0;
                    dateList.forEach((d) => {
                        offsets[d.key] = acc;
                        acc += (d?.data?.locations?.length || 0);
                    });
                    return (
                        <>
                        {/* ใช้ SortableContext แยกต่อวัน เพื่อลดการสลับชั่วคราวระหว่างวัน */}
                        {dateList.map((dateInfo) => (
                    <div
                        key={dateInfo.key}
                        ref={(el) => (dayRefs.current[dateInfo.key] = el)}
                    >
                        <SortableContext
                            items={(dateInfo.data.locations || []).map((l) => l.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <DateContainer
                                title={dateInfo.fullTitle}
                                dayData={dateInfo.data}
                                dateKey={dateInfo.key}
                                isEditing={isEditing}
                                onUpdateLocations={(locations) => handleLocationUpdate(dateInfo.key, locations)}
                                onUpdateDescription={(desc) => {
                                    const updatedItinerary = {
                                        ...planData.itinerary,
                                        [dateInfo.key]: {
                                            ...planData.itinerary[dateInfo.key],
                                            description: desc,
                                        }
                                    };
                                    const normalized = normalizeOrders(updatedItinerary);
                                    const updatedData = { ...planData, itinerary: normalized };
                                    onDataChange?.(updatedData);
                                }}
                                        baseOrderOffset={offsets[dateInfo.key] || 0}
                            />
                        </SortableContext>
                    </div>
                        ))}
                        </>
                    );
                })()}

                <DragOverlay>
                    {activeId && draggedLocation ? (
                        <div className="opacity-90 rotate-2 transform scale-105">
                            <Location
                                index={0}
                                locationData={draggedLocation}
                                isEditing={false}
                                onRemove={() => { }}
                                onStayChange={() => { }}
                                onTimeChange={() => { }}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
});

Itinerary.displayName = 'Itinerary';

export default Itinerary;