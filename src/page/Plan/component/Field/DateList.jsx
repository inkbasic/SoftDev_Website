import Location from "./Location";
import { MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import TravelTime from "./TravelTime";
import "../../css/plan.css";

export default function DateContainer({ title }) {
    const [showDetails, setShowDetails] = useState(true);

    return (
        <div className="w-full flex flex-col gap-5 border-b border-neutral-300">
            <div className="flex flex-col gap-1 relative">
                <ChevronDown
                    onClick={() => setShowDetails(!showDetails)}
                    className={`w-6 h-6 absolute -left-6 top-[25%] transition-all duration-200 cursor-pointer ${!showDetails ? '-rotate-90' : ''
                        }`}
                />
                <p className="font-bold">{title}</p>
                <p className="text-neutral-500">{showDetails ? "description" : "Siam Paragon"}</p>
            </div>

            <div className={`grid transition-all duration-500 ease-in-out bg-paper ${showDetails
                ? "mb-5 grid-rows-[1fr] overflow-visible"
                : "grid-rows-[0fr] overflow-hidden pointer-events-none"
                }`}>
                <div className="min-h-0">
                    <div className={`flex flex-col gap-5 transition-all duration-300 ${showDetails
                        ? "opacity-100 translate-y-0 delay-200"
                        : "opacity-0 -translate-y-2 delay-0"
                        }`}>
                        <Location />
                        <TravelTime />
                        <Location />
                        <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-300 rounded-[12px] px-5 py-5">
                            <MapPin className="text-neutral-500" />
                            <input type="text" className="flex-1 outline-none text-[16px]" placeholder="เพิ่มสถานที่" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}