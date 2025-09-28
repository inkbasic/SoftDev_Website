import { useEffect, useRef, useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { MockLocations, searchLocations, generateLocationId } from "../../mock/MockLocations.jsx";
import "../../css/plan.css";

export default function AddLocationPanel({ existing = [], onAdd, onAddCustom, onOpenChange }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const doSearch = (text) => {
        if (text.trim()) {
            const r = searchLocations(text).filter(x => !existing.find(e => e.id === x.id));
            setResults(r);
        } else {
            const popular = MockLocations.slice(0, 5).filter(x => !existing.find(e => e.id === x.id));
            setResults(popular);
        }
    };

    useEffect(() => {
        onOpenChange?.(results.length > 0); // แจ้ง parent ว่า dropdown เปิด/ปิด
    }, [results.length, onOpenChange]);

    useEffect(() => {
        const onDown = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setResults([]);
        };
        if (results.length > 0) document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [results.length]);

    return (
        <div ref={containerRef} className="search-container">
            <div
                ref={inputRef}
                className="flex items-center gap-3 bg-white border-2 border-blue-200 rounded-xl px-4 py-4 shadow-sm hover:border-blue-300 focus-within:border-blue-400 transition-colors duration-200"
            >
                <Search className="w-5 h-5 text-blue-500" />
                <input
                    type="text"
                    className="flex-1 outline-none text-[16px] placeholder-gray-400"
                    placeholder="ค้นหาสถานที่ที่ต้องการเพิ่ม..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); doSearch(e.target.value); }}
                    onFocus={() => { if (!query) doSearch(""); }}
                />
                {query && (
                    <button
                        onClick={() => { setQuery(""); setResults([]); }}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-150"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            </div>

            {results.length > 0 && (
                <div className="search-dropdown top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-80 overflow-y-auto z-[210]">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 sticky top-0">
                        <p className="text-sm font-medium text-gray-600">
                            {query ? "ผลการค้นหา" : "สถานที่ยอดนิยม"}
                        </p>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                        {results.map((loc) => (
                            <div
                                key={loc.id}
                                className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-b-0 search-dropdown-item"
                                onClick={() => { onAdd?.(loc); setQuery(""); setResults([]); }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-primary rounded-lg flex items-center justify-center text-white font-bold">
                                        {loc.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{loc.name}</p>
                                        <p className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                                            {loc.category}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{loc.openHours}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}