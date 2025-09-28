import { useState } from "react";
import { ChevronDown } from "lucide-react";
import LocationList from "./LocationList";
import AddLocationPanel from "./AddLocationPanel";

export default function DateContainer({ title, dayData, isEditing = false, onUpdateLocations }) {
    const [showDetails, setShowDetails] = useState(true);
    const [locations, setLocations] = useState(dayData?.locations || []);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const travelTimes = dayData?.travelTimes || [];
    const description = dayData?.description || "Siam Paragon";

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

    const handleReorderLocation = (fromIndex, toIndex) => {
        const list = [...locations];
        const [moved] = list.splice(fromIndex, 1);
        list.splice(toIndex, 0, moved);
        const updated = list.map((l, i) => ({ ...l, order: i + 1 }));
        applyAndBubble(updated);
    };

    const handleAddLocation = (loc) => {
        const updated = [...locations, { ...loc, order: locations.length + 1 }];
        applyAndBubble(updated);
    };

    const handleAddCustomLocation = (customLoc) => {
        const updated = [...locations, { ...customLoc, order: locations.length + 1 }];
        applyAndBubble(updated);
    };

    return (
        <div className={`w-full flex flex-col gap-5 border-b border-neutral-300`}>
            <div className="flex flex-col gap-1 relative">
                <ChevronDown
                    onClick={() => setShowDetails(!showDetails)}
                    className={`w-6 h-6 absolute -left-6 top-[25%] transition-all duration-200 cursor-pointer ${!showDetails ? '-rotate-90' : ''}`}
                />
                <p className="font-bold">{title}</p>
                <p className="text-neutral-500">
                    {showDetails ? description : locations[0]?.name || "ไม่มีกิจกรรม"}
                </p>
            </div>

            <div
                className={`grid transition-all duration-500 ease-in-out bg-paper relative ${
                    showDetails ? "mb-5 grid-rows-[1fr]" : "grid-rows-[0fr] overflow-hidden pointer-events-none"
                } ${dropdownOpen ? "z-[200] overflow-visible" : ""}`}  // RAISE WHEN OPEN
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
                        />

                        {isEditing && (
                            <AddLocationPanel
                                existing={locations}
                                onAdd={handleAddLocation}
                                onAddCustom={handleAddCustomLocation}
                                onOpenChange={setDropdownOpen} // NEW
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}