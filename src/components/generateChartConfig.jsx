// สร้างสีสำหรับ series (สูงสุด 5 ค่า)
const defaultColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function generateChartConfig(chartData) {
    if (!chartData || chartData.length === 0) return {};

    // รวม key ของทุก object ใน chartData
    const allKeys = chartData.flatMap((item) => Object.keys(item));
    const uniqueKeys = Array.from(new Set(allKeys));

    // ลบ key "date" เพราะไม่ใช่ series
    const seriesKeys = uniqueKeys.filter((key) => key !== "date").slice(0, 5); // สูงสุด 5 ค่า

    // สร้าง config
    const chartConfig = { visitors: { label: "Visitors" } }; // สามารถปรับได้

    seriesKeys.forEach((key, index) => {
        chartConfig[key] = {
            label: key.charAt(0).toUpperCase() + key.slice(1), // ตั้ง label จาก key
            color: defaultColors[index] || "var(--chart-default)", // ใส่สีตามลำดับ
        };
    });

    return chartConfig;
}
