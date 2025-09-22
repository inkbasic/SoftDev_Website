import DropdownMenu from "./DropdownMenu";
export default function Side({ onItemClick }) {
    return (
        <div className="h-full flex flex-col border-r border-neutral-300 p-2 gap-3 bg-paper">
            <DropdownMenu
                title={"ภาพรวม"}
                items={["ภาพรวม", "ที่พัก", "เช่ารถ"]}
                onItemClick={onItemClick}/>
            <DropdownMenu
                title={"กำหนดการ"}
                items={["วันจันทร์ 25/8", "วันอังคาร 26/8", "วันพุธ 27/8", "วันพฤหัส 28/8", "วันศุกร์ 29/8", "วันเสาร์ 30/8", "วันอาทิตย์ 31/8"]} 
                onItemClick={onItemClick}/>
        </div>
    );
}