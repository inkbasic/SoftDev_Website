import { LucideX, LucideSave, LucideEllipsis } from "lucide-react";
export const CancelButton = ({ onClick, children = "ยกเลิก", ...props }) => {
    return (
        <button
            onClick={onClick}
            className="flex gap-1 bg-transparent border border-primary rounded-[4px] px-2 py-1 cursor-pointer"
            {...props}
        >
            <LucideX stroke="#FF7474" />
            <p className="text-primary">ยกเลิก</p>
        </button>
    );
};

export const SaveButton = ({ onClick, children = "บันทึก", ...props }) => {
    return (
        <button
            onClick={onClick}
            className="flex gap-1 btnBackground border border-primary rounded-[4px] px-2 py-1 cursor-pointer"
            {...props}
        >
            <LucideSave stroke="#F9FBFF" strokeWidth={1.5} />
            <p className="text-paper">บันทึก</p>
        </button>
    );
};

export const MeatButton = ({ onClick, children, click = false, ...props }) => {
    return (
        <>
            <button
                onClick={onClick}
                className={`flex gap-1 cursor-pointer rounded-full p-1 hover:bg-neutral-200 ${click ? 'bg-neutral-200' : ''}`}
                {...props}
            >
                <LucideEllipsis />
            </button>
            {children}
        </>
    );
};

export const CalendarButton = ({ onClick, children = "เพิ่มกำหนดการ", ...props }) => {
    return (
        <button
            onClick={onClick}
            className={`flex gap-1 cursor-pointer rounded-full p-1 hover:bg-neutral-200`}
            {...props}
        >
            <LucideEllipsis />
            <p>{children}</p>
        </button>
    );
};
