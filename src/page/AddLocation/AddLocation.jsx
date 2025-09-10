import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function InputField({ label, value, id }) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} name={id} placeholder={value} />
        </div>
    );
}

function FormSection({ title, description, fields }) {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div>
                <h2 className="text-xl">{title}</h2>
                <p className="text-neutral-500">{description}</p>
            </div>
            {fields.map((field) => (
                <InputField key={field.id} label={field.label} value={field.value} id={field.id} />
            ))}
        </div>
    );
}

function ReusableSelect({ label, placeholder, options }) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default function AddLocation() {
    return (
        <div className="w-screen py-20 px-6 sm:px-20 flex flex-col gap-12 justify-center items-center">
            <h1 className="text-2xl font-semibold w-full max-w-5xl">เพิ่มข้อมูลสถานที่</h1>
            <div className="flex flex-col gap-20 w-full max-w-5xl">
                <FormSection
                    title="ข้อมูลพื้นฐาน"
                    description="กรอกชื่อและรายละเอียดหลักของสถานที่ เพื่อให้ผู้เข้าชมรู้จักธุรกิจของคุณได้ง่ายขึ้น"
                    fields={[
                        { label: "ชื่อผู้ใช้", value: "John Doe", id: "username" },
                        { label: "อีเมล", value: "example@email.com", id: "email" },
                        { label: "คำอธิบาย", value: "ใส่คำโปรยสั้น ๆ เพื่อดึงดูดนักท่องเที่ยว", id: "description" },
                        {
                            label: "รายละเอียดเพิ่มเติม",
                            value: "บรรยายจุดเด่น บรรยากาศ และประสบการณ์ที่จะได้รับ",
                            id: "more_details",
                        },
                    ]}
                />

                <FormSection
                    title="ข้อมูลติดต่อ"
                    description="ใส่ที่อยู่ เบอร์โทร อีเมล หรือโซเชียลมีเดีย เพื่อให้นักท่องเที่ยวติดต่อคุณได้สะดวก"
                    fields={[
                        { label: "ที่อยู่", value: "เช่น 123/45 หมู่บ้านสุขใจ อ.เมือง จ.เชียงใหม่", id: "location" },
                        { label: "พิกัดแผนที่", value: "วางลิงก์ Google Maps", id: "googlemap" },
                        { label: "เว็บไซต์", value: "เช่น facebook.com/mountainstay", id: "website" },
                    ]}
                />

                <FormSection
                    title="รูปภาพ & สื่อ"
                    description="อัปโหลดภาพถ่ายหรือวิดีโอที่สวยงาม เพื่อดึงดูดความสนใจของนักท่องเที่ยว"
                    fields={[{ label: "อัปโหลดรูปภาพสถานที่", value: "วางลิงก์รูปภาพ", id: "picture" }]}
                />

                <FormSection
                    title="ราคา & แพ็กเกจ"
                    description="แสดงช่วงราคาและโปรโมชั่นพิเศษ เพื่อช่วยให้นักท่องเที่ยวตัดสินใจได้ง่ายขึ้น"
                    fields={[
                        { label: "ช่วงราคา", value: "เช่น เริ่มต้น 1,200 บาท/คืน", id: "price_range" },
                        {
                            label: "โปรโมชั่น/แพ็กเกจพิเศษ",
                            value: "เช่น ลด 10% สำหรับลูกค้าที่จองภายในเดือนนี้",
                            id: "promotion",
                        },
                    ]}
                />

                <div className="flex flex-col gap-6 w-full">
                    <div>
                        <h2 className="text-xl">การตั้งค่าโฆษณา</h2>
                        <p className="text-neutral-500">
                            เลือกกลุ่มเป้าหมาย ระยะเวลา และแพ็กเกจโฆษณาที่เหมาะสม
                            เพื่อโปรโมทสถานที่ของคุณให้ได้ผลดีที่สุด
                        </p>
                    </div>
                    <ReusableSelect
                        label="กลุ่มเป้าหมาย"
                        placeholder="เช่น นักท่องเที่ยวไทย"
                        options={[
                            { value: "thai_tourists", label: "นักท่องเที่ยวไทย" },
                            { value: "foreign_tourists", label: "นักท่องเที่ยวต่างชาติ" },
                            { value: "family", label: "ครอบครัว" },
                            { value: "working_age", label: "วัยทำงาน" },
                            { value: "lover", label: "คู่รัก" },
                        ]}
                    />
                    <ReusableSelect
                        label="ระยะเวลาโฆษณา"
                        placeholder="เช่น 7 วัน"
                        options={[
                            { value: "7_day", label: "7 วัน" },
                            { value: "14_day", label: "14 วัน" },
                            { value: "30_day", label: "30 วัน" },
                        ]}
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant="outline">ยกเลิก</Button>
                    <Button>บันทึก</Button>
                </div>
            </div>
        </div>
    );
}
