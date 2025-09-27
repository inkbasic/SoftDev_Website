import Pool from "../../../../../public/img/pool.jpg";
import { GripVertical, LucideTrash2 } from "lucide-react";

export default function Location({ locationData, isEditing = false }) {
    const {
        name = "Siam Paragon",
        openHours = "เปิด 10.00 - 22.00", 
        description = "ห้างสรรพสินค้าขนาดใหญ่ที่มีร้านบูติกระดับไฮเอนด์และร้านทั่วไป ร้านอาหาร โบว์ลิ่ง และโรงภาพยนตร์มัลติเพล็กซ์",
        image = Pool,
        order = 1
    } = locationData || {};

    return (
        <div className="flex gap-2 h-40 w-full bg-white">
            <div className="flex flex-col gap-2 px-5 py-3 rounded-[8px] border border-neutral-200 w-full h-full relative">
                <p className="font-bold">{name}</p>
                <p>{openHours}</p>
                <p className="text-neutral-500">{description}</p>
                
                {/* แสดงเฉพาะเมื่อแก้ไข */}
                {isEditing && (
                    <>
                        <GripVertical 
                            className="absolute -left-6 top-1/2 transform -translate-y-1/2 cursor-move" 
                            stroke="#737373" 
                        />
                        <LucideTrash2 
                            className="absolute -right-12 top-1/2 transform -translate-y-1/2 cursor-pointer hover:stroke-red-500" 
                            stroke="#737373" 
                            strokeWidth={1} 
                        />
                    </>
                )}
                
                <p className="absolute -left-3 text-sm text-paper bg-accent w-6 h-6 text-center rounded-full">
                    {order}
                </p>
            </div>
            <div className="flex items-center w-76 h-full bg-neutral-200 rounded-[8px] justify-center overflow-hidden">
                <img src={image} className="object-cover w-full h-full" alt={name} />
            </div>
        </div>
    );
}