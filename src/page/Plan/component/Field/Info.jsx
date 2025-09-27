export default function Info({data}) {
    return (
        <>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="font-bold">หมวดหมู่</p>
                    <p className="text-neutral-500">{data.category.join(", ")}</p>
                </div>
                <div>
                    <p className="font-bold">วันที่</p>
                    <p className="text-neutral-500">{data.startDate} - {data.endDate}</p>
                </div>
                <div>
                    <p className="font-bold">ค่าใช้จ่ายโดยประมาณ</p>
                    <p className="text-neutral-500">{data.budget} ฿</p>
                </div>
                <div>
                    <p className="font-bold">จำนวนคน</p>
                    <p className="text-neutral-500">{data.people} คน</p>
                </div>
            </div>
        </>
    );
}