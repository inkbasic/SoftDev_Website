import Pool from "/img/pool.jpg";
import { GripVertical, Trash2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

export default function Location({
    index,
    locationData,
    isEditing = false,
    onRemove,
    onStayChange,
    onTimeChange,
    displayOrder,
}) {
    const {
        id,
        name = "Siam Paragon",
        openHours = "เปิด 10.00 - 22.00",
        description = "ห้างสรรพสินค้าขนาดใหญ่ที่มีร้านบูติกระดับไฮเอนด์และร้านทั่วไป ร้านอาหาร โบว์ลิ่ง และโรงภาพยนตร์มัลติเพล็กซ์",
        image = Pool,
        order = 1,
        startTime,
        endTime
    } = locationData || {};

    // ใช้ sortable hook สำหรับ drag & drop
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: id,
        disabled: !isEditing
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // helper: "HH:mm" <-> dayjs
    const hhmmToDayjs = (s) => {
        if (!s) return null;
        const [h, m] = String(s).split(":").map(Number);
        return dayjs().hour(h || 0).minute(m || 0).second(0).millisecond(0);
    };
    const toHHmm = (d) => (d ? d.format("HH:mm") : null);

    const [start, setStart] = useState(hhmmToDayjs(startTime));
    const [end, setEnd] = useState(hhmmToDayjs(endTime));
    const [timeError, setTimeError] = useState("");

    useEffect(() => {
        setStart(hhmmToDayjs(startTime));
        setEnd(hhmmToDayjs(endTime));
    }, [startTime, endTime]);

    const tryCommit = (s, e) => {
        setTimeError("");
        if (!s || !e) return; // ยังไม่เลือกครบ
        if (!s.isBefore(e)) {
            setTimeError("เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
            return;
        }
        onTimeChange?.(toHHmm(s), toHHmm(e));
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className={`flex gap-2 h-40 w-full bg-white relative location-card ${isDragging ? 'z-50' : ''}`}
        >
            <div className="flex flex-col gap-2 px-5 py-3 rounded-[8px] border border-neutral-200 w-full h-full relative">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-bold w-40 truncate">{name}</p>
                            <div className="flex gap-2 items-center w-fit">
                                {isEditing ? (
                                    <>
                                        <div className="flex items-center gap-2 w-fit">
                                            <TimePicker
                                                format="HH:mm"
                                                value={start}
                                                onChange={(val) => { setStart(val); tryCommit(val, end); }}
                                                allowClear={false}
                                                minuteStep={5}
                                                inputReadOnly
                                                placeholder="เริ่ม"
                                                className="w-full"
                                                showNow={false}
                                            />
                                            <span className="text-sm text-neutral-500">-</span>
                                            <TimePicker
                                                format="HH:mm"
                                                value={end}
                                                onChange={(val) => { setEnd(val); tryCommit(start, val); }}
                                                allowClear={false}
                                                minuteStep={5}
                                                inputReadOnly
                                                placeholder="สิ้นสุด"
                                                className="w-full"
                                                showNow={false}
                                            />
                                        </div>
                                        {timeError && <span className="text-xs text-red-500">{timeError}</span>}
                                    </>
                                ) : (
                                    start && end && (
                                        <p>ช่วง {toHHmm(start)}-{toHHmm(end)}</p>
                                    )
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-neutral-600">{openHours}</p>
                    </div>
                </div>

                <p className="text-neutral-500 text-sm line-clamp-3">{description}</p>

                {isEditing && (
                    <>
                        {/* Drag Handle */}
                        <div
                            {...attributes}
                            {...listeners}
                            className="absolute -left-6 top-1/2 -translate-y-1/2 text-neutral-400 cursor-grab active:cursor-grabbing hover:text-neutral-600 transition-colors"
                            title="ลากเพื่อสลับลำดับ"
                        >
                            <GripVertical className="w-5 h-5" />
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={onRemove}
                            className="absolute cursor-pointer -right-60 top-1/2 transform -translate-y-1/2 p-1 rounded text-neutral-400 hover:text-red-500 transition-colors duration-200"
                            title="ลบสถานที่"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </>
                )}

                <div className="absolute -left-3 top-3 text-sm text-white bg-accent w-6 h-6 flex items-center justify-center rounded-full text-center font-bold">
                    {displayOrder ?? order}
                </div>
            </div>

            <div className="flex items-center w-76 h-full bg-neutral-200 rounded-[8px] justify-center overflow-hidden">
                <img src={image} className="object-cover w-full h-full" alt={name} />
            </div>
        </div>
    );
}