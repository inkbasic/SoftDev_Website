import DropdownMenu from "./DropdownMenu";
export default function Side() {
    return (
        <div className="h-full flex flex-col border-r border-neutral-300 ">
            <DropdownMenu title={"ภาพรวม"} items={["ภาพรวม","ที่พัก", "เช่ารถ"]} />
            <DropdownMenu title={"กำหนดการทั้งหมด"} items={["วันจันทร์ 25/8","วันอังคาร 26/8", "วันพุธ 27/8", "วันพฤหัสบดี 28/8", "วันศุกร์ 29/8", "วันเสาร์ 30/8", "วันอาทิตย์ 31/8"]} /> 
        </div>
    );
}