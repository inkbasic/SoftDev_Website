import Location from "./Location";
import { MapPin } from "lucide-react";
export default function Itinerary() {
    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex justify-between items-center w-full">
                <h3>แผนการท่องเที่ยว</h3>
                <div>ปุ่ม</div>
            </div>

            <div className="w-full flex flex-col gap-5 border-b border-neutral-300 pb-5">
                <div className="flex flex-col gap-1">
                    <p className="font-bold">วันจันทร์, 25 สิงหาคม</p>
                    <p className="text-neutral-500">description</p>
                </div>
                <div className="w-full">
                    <Location />
                </div>
                <div className="flex items-center gap-2 bg-neutral-200 rounded-[12px] px-5 py-5">
                    <MapPin className="text-neutral-500" />
                    <p className="text-neutral-500">เพิ่มสถานที่</p>
                </div>
            </div>
        </div>
    );
}
