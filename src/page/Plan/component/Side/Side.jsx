import DropdownMenu from "./DropdownMenu";
import { useMemo } from "react";

export default function Side({ onItemClick, fieldRef, planData }) {
    // สร้างรายการวันที่จาก planData
    const dateItems = useMemo(() => {
        if (!planData?.startDate || !planData?.endDate) {
            return ["วันจันทร์ 25/8", "วันอังคาร 26/8", "วันพุธ 27/8"];
        }

        const dates = [];
        const currentDate = new Date(planData.startDate);
        const endDate = new Date(planData.endDate);
        
        while (currentDate <= endDate) {
            const dayName = currentDate.toLocaleDateString('th-TH', { weekday: 'long' });
            const sidebarFormat = `${dayName} ${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
            
            dates.push(sidebarFormat);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    }, [planData?.startDate, planData?.endDate]);

    return (
        <div className="h-full flex flex-col border-r border-neutral-300 p-2 gap-3 bg-paper">
            <DropdownMenu
                title={"ภาพรวม"}
                items={["ภาพรวม", "ที่พัก", "เช่ารถ"]}
                onItemClick={onItemClick}
            />
            <DropdownMenu
                title={"กำหนดการ"}
                items={dateItems}
                onItemClick={onItemClick}
            />
        </div>
    );
}