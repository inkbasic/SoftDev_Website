import Pool from "../../../../../public/img/pool.jpg";
import { GripVertical, LucideTrash2 } from "lucide-react";
export default function Location() {
    return (
        <div className="flex w-full h-40 gap-2 bg-white">
            <div className="flex flex-col gap-2 px-5 py-3 rounded-[8px] border border-neutral-200 w-full h-full relative">
                <p className="font-bold">Siam Paragon</p>
                <p>เปิด 10.00 - 22.00</p>
                <p className="text-neutral-500">ห้างสรรพสินค้าขนาดใหญ่ที่มีร้านบูติกระดับ
                    ไฮเอนด์และร้านทั่วไป
                    ร้านอาหาร  โบว์ลิ่ง
                    และโรงภาพยนตร์มัลติเพล็กซ์</p>
                <GripVertical className="absolute transform -translate-y-1/2 -left-6 top-1/2" stroke="#737373" />
                <LucideTrash2 className="absolute transform -translate-y-1/2 -right-59 top-1/2" stroke="#737373" strokeWidth={1} />
                <p className="absolute -left-3 text-sm text-paper bg-[#f5f5f5] w-6 h-6 text-center rounded-full">1</p>
            </div>
            <div className="flex items-center w-76 h-full bg-neutral-200 rounded-[8px] justify-center overflow-hidden">
                <img src={Pool} className="object-cover w-full h-full" />
            </div>
        </div>
    );
}
