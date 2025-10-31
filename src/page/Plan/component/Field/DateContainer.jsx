import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { arrayMove } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import LocationList from "./LocationList.jsx";
import AddLocationPanel from "./AddLocationPanel.jsx";

export default function DateContainer({ title, dayData, dateKey, isEditing = false, onUpdateLocations, onUpdateDescription }) {
    const [showDetails, setShowDetails] = useState(true);
    const [locations, setLocations] = useState(dayData?.locations || []);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const travelTimes = dayData?.travelTimes || [];
    const description = dayData?.description || "Siam Paragon";
    const [descValue, setDescValue] = useState(description);

    // เพิ่ม droppable zone
    const { setNodeRef, isOver } = useDroppable({
        id: `drop-zone-${dateKey}`,
    });

    useEffect(() => {
        setLocations(dayData?.locations || []);
    }, [dayData?.locations]);

    // useEffect(() => {
    //     setDescValue(dayData?.description || "");
    // }, [dayData?.description]);

    const applyAndBubble = (updated) => {
        setLocations(updated);
        onUpdateLocations?.(updated);
    };

    const handleRemoveLocation = (locationId) => {
        const updated = locations
            .filter(l => l.id !== locationId)
            .map((l, i) => ({ ...l, order: i + 1 }));
        applyAndBubble(updated);
    };

    const handleReorderLocation = (oldIndex, newIndex) => {
        const reorderedLocations = arrayMove(locations, oldIndex, newIndex);
        const updated = reorderedLocations.map((l, i) => ({ ...l, order: i + 1 }));
        applyAndBubble(updated);
    };

    const handleAddLocation = (loc) => {
        const newLocation = {
            ...loc,
            id: loc.id || `location-${Date.now()}-${Math.random()}`,
        };
        const updated = [...locations, newLocation];
        setLocations(updated);
        onUpdateLocations?.(updated);
    };

    const handleAddCustomLocation = (custom) => {
        const newLoc = {
            ...custom,
            id: custom.id || `custom-${Date.now()}-${Math.random()}`,
        };
        const updated = [...locations, newLoc];
        setLocations(updated);
        onUpdateLocations?.(updated);
    };

    const handleTimeChange = (index, start, end) => {
        const updated = [...locations];
        updated[index] = {
            ...updated[index],
            startTime: start,
            endTime: end
        };
        setLocations(updated);
        onUpdateLocations?.(updated);
    };

    return (
        <div className={`w-full flex flex-col gap-5 border-b border-neutral-300`}>
            <div className="flex flex-col gap-1 relative">
                <ChevronDown
                    onClick={() => setShowDetails(!showDetails)}
                    className={`w-6 h-6 absolute -left-6 top-[25%] transition-all duration-200 cursor-pointer ${!showDetails ? '-rotate-90' : ''}`}
                />
                <p className="font-bold">{title}</p>
                <div className="text-neutral-500">
                    {isEditing && showDetails ? (
                        <input
                            type="text"
                            className="w-full border border-neutral-200 rounded-md px-2 text-[1ุุ6px] outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="เพิ่มคำอธิบายของวันนี้..."
                            value={descValue}
                            onChange={(e) => {
                                const v = e.target.value;
                                setDescValue(v);
                                onUpdateDescription?.(v);
                            }}
                        />
                    ) : (
                        <p>{showDetails ? description : locations[0]?.name || "ไม่มีกิจกรรม"}</p>
                    )}
                </div>
            </div>

            <div
                ref={setNodeRef}
                className={`grid transition-all duration-500 ease-in-out bg-paper relative ${
                    showDetails ? "mb-5 grid-rows-[1fr]" : "grid-rows-[0fr] overflow-hidden pointer-events-none"
                } ${dropdownOpen ? "z-[200] overflow-visible" : ""} ${
                    isOver && isEditing ? "ring-2 ring-blue-300 ring-opacity-50" : ""
                }`}
            >
                <div className="min-h-0">
                    <div className={`flex flex-col gap-5 transition-all duration-300 ${
                        showDetails ? "opacity-100 translate-y-0 delay-200" : "opacity-0 -translate-y-2 delay-0"
                    }`}>
                        <LocationList
                            locations={locations}
                            travelTimes={travelTimes}
                            isEditing={isEditing}
                            onRemove={handleRemoveLocation}
                            onReorder={handleReorderLocation}
                            onTimeChange={handleTimeChange}
                            enableDragDrop={false} // ปิดใน LocationList เพราะจัดการที่ Itinerary แล้ว
                        />

                        {isEditing && (
                            <AddLocationPanel
                                existing={locations}
                                onAdd={handleAddLocation}
                                onAddCustom={handleAddCustomLocation}
                                onOpenChange={setDropdownOpen}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}