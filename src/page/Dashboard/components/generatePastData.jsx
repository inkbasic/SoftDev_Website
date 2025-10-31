/**
 * สร้างข้อมูลย้อนหลัง N วัน จาก array ของ object ที่ได้จาก API
 * @param {Array} apiData - array ของ object ที่มาจาก API
 * @param {number} length - จำนวนข้อมูลย้อนหลังที่ต้องการ (default = 15)
 * @returns {Array} array ของ object ย้อนหลังตามจำนวนวัน
 */
export function generatePastData(apiData, length = 15) {
    if (!Array.isArray(apiData) || apiData.length === 0) return [];

    // ใช้ date ของ element แรกเป็นจุดอ้างอิง
    const baseDate = new Date(apiData[0].date);

    // ใช้ keys จาก object แรกเป็น template
    const keys = Object.keys(apiData[0]).filter((k) => k !== "date");

    let result = [];
    
    for (let i = 0; i < length - apiData.length; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() - i - 1);

        // สร้าง object ใหม่ โดย copy keys ที่เหลือแล้วตั้งค่าเป็น 0
        const obj = { date: d.toISOString().split("T")[0] };
        keys.forEach((k) => (obj[k] = 0));

        result.push(obj);
    }

    // result = result.reverse();
    return result.reverse().concat(apiData);
}