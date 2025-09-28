import { useState, useRef, useEffect } from "react";
import Location from "./Location";
import { MapPin, ChevronDown, Search, Plus, X } from "lucide-react";
import TravelTime from "./TravelTime";
import { MockLocations, searchLocations, generateLocationId } from "../../mock/MockLocations.jsx";
import "../../css/plan.css";

export default function DateContainer({ title, dayData, isEditing = false, onUpdateLocations }) {
    const [showDetails, setShowDetails] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [locations, setLocations] = useState(dayData?.locations || []);

    const searchInputRef = useRef(null);
    const containerRef = useRef(null);
    const travelTimes = dayData?.travelTimes || [];
    const description = dayData?.description || "Siam Paragon";

    // ค้นหาสถานที่
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            const results = searchLocations(query).filter(
                result => !locations.find(loc => loc.id === result.id)
            );
            setSearchResults(results);
        } else {
            // แสดงสถานที่ยอดนิยมเมื่อไม่มีการค้นหา
            const popular = MockLocations.slice(0, 5).filter(
                loc => !locations.find(existing => existing.id === loc.id)
            );
            setSearchResults(popular);
        }
    };

    // เพิ่มสถานที่จากการค้นหา
    const handleAddLocation = (location) => {
        const newLocation = {
            ...location,
            order: locations.length + 1
        };

        const updatedLocations = [...locations, newLocation];
        setLocations(updatedLocations);

        if (onUpdateLocations) {
            onUpdateLocations(updatedLocations);
        }

        // รีเซ็ต
        setSearchQuery("");
        setSearchResults([]);
    };

    // เพิ่มสถานที่ใหม่ (manual)
    const handleAddCustomLocation = () => {
        if (!searchQuery.trim()) return;

        const newLocation = {
            id: generateLocationId(),
            name: searchQuery.trim(),
            openHours: "ไม่ระบุ",
            description: "สถานที่ที่เพิ่มโดยผู้ใช้",
            image: "/public/img/pool.jpg",
            category: "อื่นๆ",
            rating: 0,
            order: locations.length + 1
        };

        const updatedLocations = [...locations, newLocation];
        setLocations(updatedLocations);

        if (onUpdateLocations) {
            onUpdateLocations(updatedLocations);
        }

        setSearchQuery("");
        setSearchResults([]);
    };

    // ลบสถานที่
    const handleRemoveLocation = (locationId) => {
        const updatedLocations = locations.filter(loc => loc.id !== locationId)
            .map((loc, index) => ({ ...loc, order: index + 1 }));

        setLocations(updatedLocations);

        if (onUpdateLocations) {
            onUpdateLocations(updatedLocations);
        }
    };

    // จัดเรียงสถานที่
    const handleReorderLocation = (fromIndex, toIndex) => {
        const updatedLocations = [...locations];
        const [removed] = updatedLocations.splice(fromIndex, 1);
        updatedLocations.splice(toIndex, 0, removed);

        const reorderedLocations = updatedLocations.map((loc, index) => ({
            ...loc,
            order: index + 1
        }));

        setLocations(reorderedLocations);

        if (onUpdateLocations) {
            onUpdateLocations(reorderedLocations);
        }
    };

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };

        if (searchResults.length > 0) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchResults.length]);

    return (
        <div className="w-full flex flex-col gap-5 border-b border-neutral-300">
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

            <div className={`grid transition-all duration-500 ease-in-out bg-paper relative ${showDetails
                ? "mb-5 grid-rows-[1fr]" 
                : "grid-rows-[0fr] overflow-hidden pointer-events-none"
                }`}
            >
                <div className="min-h-0">
                    <div className={`flex flex-col gap-5 transition-all duration-300 ${showDetails
                        ? "opacity-100 translate-y-0 delay-200"
                        : "opacity-0 -translate-y-2 delay-0"
                        }`}>

                        {/* แสดง locations */}
                        <div className="flex flex-col gap-3">
                            {locations.map((location, index) => (
                                <div key={location.id} className="relative">
                                    <Location
                                        locationData={location}
                                        isEditing={isEditing}
                                        onRemove={() => handleRemoveLocation(location.id)}
                                        onReorder={(direction) => {
                                            if (direction === 'up' && index > 0) {
                                                handleReorderLocation(index, index - 1);
                                            } else if (direction === 'down' && index < locations.length - 1) {
                                                handleReorderLocation(index, index + 1);
                                            }
                                        }}
                                        canMoveUp={index > 0}
                                        canMoveDown={index < locations.length - 1}
                                    />
                                    {travelTimes[index] && (
                                        <TravelTime data={travelTimes[index]} />
                                    )}
                                </div>
                            ))}
                        </div>



                        {isEditing && (
                            <div ref={containerRef} className="search-container"> {/* เพิ่ม class */}
                                <div
                                    ref={searchInputRef}
                                    className="flex items-center gap-3 bg-white border-2 border-blue-200 rounded-xl px-4 py-4 shadow-sm hover:border-blue-300 focus-within:border-blue-400 transition-colors duration-200"
                                >
                                    <Search className="w-5 h-5 text-blue-500" />
                                    <input
                                        type="text"
                                        className="flex-1 outline-none text-[16px] placeholder-gray-400"
                                        placeholder="ค้นหาสถานที่ที่ต้องการเพิ่ม..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onFocus={() => {
                                            if (!searchQuery && locations.length < 10) {
                                                handleSearch('');
                                            }
                                        }}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSearchResults([]);
                                            }}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-150"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    )}
                                </div>

                                {/* Search Results Dropdown */}
                                {searchResults.length > 0 && (
                                    <div className="search-dropdown top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                                        {/* ลบ style={{ zIndex: 1001 }} ออก */}
                                        {/* เนื้อหาเหมือนเดิม */}
                                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 sticky top-0">
                                            <p className="text-sm font-medium text-gray-600">
                                                {searchQuery ? 'ผลการค้นหา' : 'สถานที่ยอดนิยม'}
                                            </p>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto">
                                            {searchResults.map((location) => (
                                                <div
                                                    key={location.id}
                                                    className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-b-0 search-dropdown-item"
                                                    onClick={() => handleAddLocation(location)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                            {location.name.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 truncate">{location.name}</p>
                                                            <p className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                                                                {location.category}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">{location.openHours}</p>
                                                            {location.rating > 0 && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <span className="text-yellow-500">⭐</span>
                                                                    <span className="text-xs text-gray-600">{location.rating}/5</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Plus className="w-5 h-5 text-blue-500" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {searchQuery && !searchResults.some(loc => loc.name.toLowerCase() === searchQuery.toLowerCase()) && (
                                            <div className="border-t border-gray-100 p-4">
                                                <button
                                                    onClick={handleAddCustomLocation}
                                                    className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-150"
                                                >
                                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                        <Plus className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-medium text-blue-800">เพิ่ม "{searchQuery}" เป็นสถานที่ใหม่</p>
                                                        <p className="text-sm text-blue-600">สถานที่ที่เพิ่มโดยผู้ใช้</p>
                                                    </div>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}