import Card from "./Card";
import Info from "./Info";
import BusinessCard from "./BusinessCard";
import { useRef } from "react";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";
export default function Field() {
    const scrollRef = useRef(null);
    useAutoHideScrollbar(scrollRef);
    return (
        <div className="h-full w-full flex flex-col gap-5 px-20 py-5 justify-start items-center bg-paper overflow-x-clip scroll-auto-hide" 
        ref={scrollRef}>
            <div className="w-full flex flex-col gap-1">
                <div className="flex justify-between items-center w-full">
                    <h3>บางแสน...แสนสาหัส</h3>
                    <div>
                        ปุ่ม
                    </div>
                </div>
                <p className="text-neutral-500">แก้ไขล่าสุด : 25 สิงหาคม 2568</p>
            </div>
            <Card>
                <Info />
            </Card>

            <Card >
                    <p className="font-bold">โรงแรม</p>
                    <div className="w-full flex justify-center items-center gap-3 py-2">
                        <BusinessCard showStar={true}/>
                        <BusinessCard showStar={true}/>
                        <BusinessCard showStar={true}/>
                    </div>
                    <div className="btnBackground w-full text-center text-paper font-bold px-4 py-2 rounded-[8px]"><p>ดูเพิ่มเติม</p></div>
            </Card>

            <Card >
                    <p className="font-bold">รถเช่า</p>
                    <div className="w-full flex justify-center items-center gap-3 py-2">
                        <BusinessCard showStar={false} />
                        <BusinessCard showStar={false}/>
                        <BusinessCard showStar={false}/>
                    </div>
                    <div className="btnBackground w-full text-center text-paper font-bold px-4 py-2 rounded-[8px]"><p>ดูเพิ่มเติม</p></div>
            </Card>
            <div>
                <h3>รถเช่า</h3>
            </div>
            <div>

                <div>
                    <h3>แผนการท่องเที่ยว</h3>
                    <div>
                        <div>วันจันทร์</div>
                        <div>
                            การ์ดเที่ยว
                        </div>
                        <div>เพิ่มสถานที่</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
