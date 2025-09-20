export default function Location() {
    return (
        <div className="flex gap-2 h-40 w-full">
            <div className="flex flex-col gap-2 px-5 py-3 rounded-[8px] border border-neutral-200 w-full h-full relative">
                <p className="font-bold">Siam Paragon</p>
                <p>เปิด 10.00 - 22.00</p>
                <p className="text-neutral-500">ห้างสรรพสินค้าขนาดใหญ่ที่มีร้านบูติกระดับ
                    ไฮเอนด์และร้านทั่วไป
                    ร้านอาหาร  โบว์ลิ่ง
                    และโรงภาพยนตร์มัลติเพล็กซ์</p>
                <p className="absolute -left-3 text-sm text-paper bg-accent w-6 h-6 text-center rounded-full">1</p>
            </div>
            <div className="flex items-center w-52 h-full bg-neutral-200 rounded-[8px] justify-center">
                <p>รูปภาพ</p>
            </div>
        </div>
    );
}
