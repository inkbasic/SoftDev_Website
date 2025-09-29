const thaiMonths = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
];

const parseYMDLocal = (str) => {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const formatDateRangeThai = (startStr, endStr) => {
  const s = parseYMDLocal(startStr);
  const e = parseYMDLocal(endStr);
  if (!s || !e) return "-";

  const sy = s.getFullYear(), ey = e.getFullYear();
  const sm = s.getMonth(), em = e.getMonth();
  const sd = s.getDate(), ed = e.getDate();

  if (sy === ey) {
    if (sm === em) {
      // 28-30 กันยายน 2025
      return `${sd}-${ed} ${thaiMonths[sm]} ${sy}`;
    }
    // 28 กันยายน - 2 ตุลาคม 2025
    return `${sd} ${thaiMonths[sm]} - ${ed} ${thaiMonths[em]} ${sy}`;
  }
  // 28 ธันวาคม 2025 - 2 มกราคม 2026
  return `${sd} ${thaiMonths[sm]} ${sy} - ${ed} ${thaiMonths[em]} ${ey}`;
};

export default function Info({data}) {
    return (
        <>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="font-bold">หมวดหมู่</p>
                    <p className="text-neutral-500">
                      {Array.isArray(data.category) ? data.category.join(", ") : (data.category ?? "-")}
                    </p>
                </div>
                <div>
                    <p className="font-bold">วันที่</p>
                    <p className="text-neutral-500">
                        {formatDateRangeThai(data.startDate, data.endDate)}
                    </p>
                </div>
                <div>
                    <p className="font-bold">ค่าใช้จ่าย</p>
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