import DropDownMulti from "@/page/Home/component/DropDownMulti.jsx";
import { ACTIVITY } from "@/const/userPick";
const thaiMonths = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
];

const parseYMDLocal = (input) => {
  if (!input) return null;
  if (input instanceof Date && !isNaN(input)) return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  const str = String(input);
  // Handle YYYY-MM-DD or ISO starting with it
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (!y || !mo || !d) return null;
    return new Date(y, mo - 1, d);
  }
  // Fallback: try Date parsing
  const dt = new Date(str);
  if (!isNaN(dt)) return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  return null;
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

export default function Info({ data, isEditing = false, onChange }) {
  const toNum = (v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  };
  const categoryArray = Array.isArray(data?.category)
    ? data.category
    : (data?.category ? [data.category] : []);
    return (
        <>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="font-bold">หมวดหมู่</p>
          {isEditing ? (
            <DropDownMulti
              placeholder="กิจกรรมที่สนใจ"
              value={categoryArray}
              onChange={(arr) => onChange?.({ category: arr })}
              options={ACTIVITY}
            />
          ) : (
            <p className="text-neutral-500">
              {Array.isArray(data.category) ? data.category.join(", ") : (data.category ?? "-")}
            </p>
          )}
                </div>
                <div>
                    <p className="font-bold">วันที่</p>
                    <p className="text-neutral-500">
                        {formatDateRangeThai(data.startDate, data.endDate)}
                    </p>
                </div>
                <div>
                    <p className="font-bold">ค่าใช้จ่าย</p>
          {isEditing ? (
            <input
              type="number"
              min={0}
              className="border border-neutral-300 rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="เช่น 5000"
              value={data?.budget ?? ""}
              onChange={(e) => onChange?.({ budget: toNum(e.target.value) })}
            />
          ) : (
            <p className="text-neutral-500">{data?.budget ?? "-"} ฿</p>
          )}
                </div>
                <div>
                    <p className="font-bold">จำนวนคน</p>
          {isEditing ? (
            <input
              type="number"
              min={1}
              className="border border-neutral-300 rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="เช่น 2"
              value={data?.people ?? ""}
              onChange={(e) => onChange?.({ people: toNum(e.target.value) })}
            />
          ) : (
            <p className="text-neutral-500">{data?.people ?? "-"} คน</p>
          )}
                </div>
            </div>
        </>
    );
}