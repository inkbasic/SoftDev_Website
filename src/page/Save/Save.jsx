import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Funnel, ChevronDown, Ellipsis, Briefcase } from "lucide-react";

export function TripCard() {
    return (
        <Card className="p-6">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                        <h4>📍 ทริปเชียงใหม่สามวันสามคืน</h4>
                        <p className="text-neutral-500 text-sm">10–12 พฤศจิกายน 2025</p>
                    </div>
                    <Ellipsis />
                </div>
                <div className="flex gap-1">
                    <Badge variant="secondary" className="bg-[#DDFAE7]">
                        <Briefcase />
                        เชียงใหม่
                    </Badge>
                    <Badge variant="secondary" className="bg-[#DDF2FF]">
                        4 คน
                    </Badge>
                    <Badge variant="secondary" className="bg-[#CBFAF0]">
                        คนชรา
                    </Badge>
                </div>
            </div>
            <p className="text-sm">
                {" "}
                ทริปเชียงใหม่ 3 วัน 2 คืน เหมาะสำหรับคนชอบธรรมชาติและวัฒนธรรม เที่ยววัดพระธาตุดอยสุเทพ ชมวิวเมือง
                ปิดท้ายซื้อของฝากก่อนเดินทางกลับ กรุงเทพฯ ...{" "}
            </p>
        </Card>
    );
}

export default function Save() {
    return (
        <div className="w-screen py-20 flex flex-col gap-12 justify-center items-center">
            <header className="flex justify-between items-center w-full max-w-5xl">
                <div className="flex gap-6 w-full max-w-xl">
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
                <TripCard />
                <TripCard />
                <TripCard />
                <TripCard />
                <TripCard />
            </main>
        </div>
    );
}
