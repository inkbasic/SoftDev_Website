import { ChevronsDown, Car, Clock, MapPin } from "lucide-react";
export default function TravelTime({ data }) {
    return (
        <>
            <div className="flex items-center gap-2 ">
                <ChevronsDown stroke="#A3A3A3" />
                <Car stroke="#A3A3A3" />
                <p className="text-neutral-400">7 นาที - ระยะทาง 5 กม.</p>
            </div>
        </>
    );
}