import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputField({ label, value, id }) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} name={id} placeholder={value} />
        </div>
    );
}

export default function AddLocation() {
    return (
        <div className="w-screen py-20 flex flex-col gap-12 justify-center items-center">
            <h1 className="text-2xl font-semibold w-full max-w-5xl">เพิ่มข้อมูลสถานที่</h1>
            <div className="flex flex-col gap-20 w-full max-w-5xl">
                <div className="flex flex-col gap-6 w-full">
                    <div>
                        <h2 className="text-xl">ข้อมูลพื้นฐาน</h2>
                        <p className="text-neutral-500">
                            กรอกชื่อและรายละเอียดหลักของสถานที่ เพื่อให้ผู้เข้าชมรู้จักธุรกิจของคุณได้ง่ายขึ้น
                        </p>
                    </div>
                    <InputField label="ชื่อผู้ใช้" value="John Doe" id="username" />
                    <InputField label="อีเมล" value="example@email.com" id="email" />
                    <InputField label="คำอธิบาย" value="ใส่คำโปรยสั้น ๆ เพื่อดึงดูดนักท่องเที่ยว" id="description" />
                    <InputField
                        label="รายละเอียดเพิ่มเติม"
                        value="บรรยายจุดเด่น บรรยากาศ และประสบการณ์ที่จะได้รับ"
                        id="more_details"
                    />
                </div>
                <div className="flex flex-col gap-6 w-full">
                    <div>
                        <h2 className="text-xl">ข้อมูลติดต่อ</h2>
                        <p className="text-neutral-500">
                            ใส่ที่อยู่ เบอร์โทร อีเมล หรือโซเชียลมีเดีย เพื่อให้นักท่องเที่ยวติดต่อคุณได้สะดวก
                        </p>
                    </div>
                    <InputField label="ที่อยู่" value="เช่น 123/45 หมู่บ้านสุขใจ อ.เมือง จ.เชียงใหม่" id="location" />
                    <InputField label="พิกัดแผนที่" value="วางลิงก์ Google Maps" id="googlemap" />
                    <InputField label="เว็บไซต์" value="เช่น facebook.com/mountainstay" id="website" />
                </div>
                <div className="flex flex-col gap-6 w-full">
                    <div>
                        <h2 className="text-xl">รูปภาพ & สื่อ</h2>
                        <p className="text-neutral-500">
                            อัปโหลดภาพถ่ายหรือวิดีโอที่สวยงาม เพื่อดึงดูดความสนใจของนักท่องเที่ยว
                        </p>
                    </div>
                    <InputField label="อัปโหลดรูปภาพสถานที่" value="วางลิงก์รูปภาพ" id="picture" />
                </div>
                <div className="flex flex-col gap-6 w-full">
                    <div>
                        <h2 className="text-xl">ราคา & แพ็กเกจ</h2>
                        <p className="text-neutral-500">
                            แสดงช่วงราคาและโปรโมชั่นพิเศษ เพื่อช่วยให้นักท่องเที่ยวตัดสินใจได้ง่ายขึ้น
                        </p>
                    </div>
                    <InputField label="ช่วงราคา" value="เช่น เริ่มต้น 1,200 บาท/คืน" id="price_range" />
                    <InputField
                        label="โปรโมชั่น/แพ็กเกจพิเศษ"
                        value="เช่น ลด 10% สำหรับลูกค้าที่จองภายในเดือนนี้"
                        id="promotion"
                    />
                </div>
                <div className="flex flex-col gap-6 w-full">
                    <div>
                        <h2 className="text-xl">การตั้งค่าโฆษณา</h2>
                        <p className="text-neutral-500">
                            เลือกกลุ่มเป้าหมาย ระยะเวลา และแพ็กเกจโฆษณาที่เหมาะสม
                            เพื่อโปรโมทสถานที่ของคุณให้ได้ผลดีที่สุด
                        </p>
                    </div>
                    <InputField label="กลุ่มเป้าหมาย" value="นักท่องเที่ยวไทย" id="target" />
                    <InputField label="ระยะเวลาโฆษณา" value="เช่น 1 เดือน" id="period" />
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant="outline">ยกเลิก</Button>
                    <Button>บันทึก</Button>
                </div>
            </div>
        </div>
    );
}
