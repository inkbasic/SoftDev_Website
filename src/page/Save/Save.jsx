import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Funnel, ChevronDown, Ellipsis, Briefcase, Users } from "lucide-react";

export function TripCard({ title, date, badges, description, maxDescLength = 125 }) {
    const shortDesc = description.length > maxDescLength ? description.slice(0, maxDescLength) + " ..." : description;

    return (
        <Card className="p-6">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                        <h4>{title}</h4>
                        <p className="text-neutral-500 text-sm">{date}</p>
                    </div>
                    <Ellipsis />
                </div>

                {/* Badge */}
                <div className="flex gap-1 flex-wrap">
                    {badges.map((b, idx) => (
                        <Badge
                            key={idx}
                            variant="secondary"
                            style={b.color ? { backgroundColor: b.color } : undefined} // ใช้ style แทน class
                        >
                            {b.isProvince && <Briefcase className="mr-1 h-4 w-4" />}
                            {b.isPeople && <Users className="mr-1 h-4 w-4" />}
                            {b.label}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* detail */}
            <p className="text-sm mt-1">{shortDesc}</p>
        </Card>
    );
}

export default function Save() {
    return (
        <div className="py-20 px-6 flex flex-col gap-12 justify-center items-center">
            <header className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center w-full max-w-5xl">
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-6 w-full lg:max-w-xl">
                    <h1 className="text-2xl font-semibold text-nowrap">แผนท่องเที่ยวทั้งหมด</h1>
                    <Input type="text" placeholder="ค้นหาจากรายการผ่านชื่อ / แท็ก" />
                </div>
                <Button variant="destructive">
                    <Funnel />
                    ตัวกรอง
                    <ChevronDown />
                </Button>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
                {Array.from({ length: 8 }).map((_, index) => (
                    <TripCard
                        key={index}
                        title="📍 ทริปเชียงใหม่สามวันสามคืน"
                        date="10–12 พฤศจิกายน 2025"
                        description="ทริปเชียงใหม่ 3 วัน 2 คืน เหมาะสำหรับคนชอบธรรมชาติและวัฒนธรรม เที่ยววัดพระธาตุดอยสุเทพ ชมวิวเมือง ปิดท้ายซื้อของฝากก่อนเดินทางกลับ กรุงเทพฯ"
                        badges={[
                            { label: "เชียงใหม่", color: "#DDFAE7", isProvince: true },
                            { label: "4 คน", color: "#DDF2FF", isPeople: true },
                            { label: "คนชรา", color: "#CBFAF0" },
                        ]}
                    />
                ))}
            </main>
        </div>
    );
}
