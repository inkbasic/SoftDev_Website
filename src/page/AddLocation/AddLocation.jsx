import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useEffect } from "react";
import { useState } from "react";

// Component สำหรับ input field
function InputField({ label, value, id, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} name={id} placeholder={value} onChange={(e) => onChange(id, e.target.value)} />
        </div>
    );
}

// Component สำหรับกลุ่มฟอร์ม
function FormSection({ title, description, fields, onChange }) {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div>
                <h2 className="text-xl">{title}</h2>
                <p className="text-neutral-500">{description}</p>
            </div>
            {fields.map((field) => (
                <InputField key={field.id} label={field.label} value={field.value} id={field.id} onChange={onChange} />
            ))}
        </div>
    );
}

// Component สำหรับ select
function ReusableSelect({ label, placeholder, options, value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <Select onValueChange={(val) => onChange(val)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} value={value} />
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

// Component หลัก
export default function AddLocation() {
    const [type, setType] = useState("accommodation"); // ประเภทข้อมูล
    const [formData, setFormData] = useState({});
    const [status, setStatus] = useState(""); // loading | success | error
    const [submitCount, setSubmitCount] = useState(0); // track กดปุ่มบันทึก
    const [showToast, setShowToast] = useState(false); // ตัวช่วยแสดง toast
    const typeLabelMap = {
        accommodation: "ที่พัก",
        attraction: "แหล่งท่องเที่ยว",
        restaurant: "ร้านอาหาร",
    };

    // ฟังก์ชันอัพเดตค่า input
    const handleInputChange = (id, value) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // สร้าง API body ตาม type
    const getApiBody = () => {
        if (type === "accommodation") {
            return {
                name: formData.name || "",
                imgaeUrl: formData.imgaeUrl || "",
                location: formData.location ? [formData.location] : [],
                description: formData.description || "",
                facilities: formData.facilities ? [formData.facilities] : [],
                starRating: formData.starRating ? Number(formData.starRating) : 0,
                redirectUrl: formData.redirectUrl || "",
            };
        } else if (type === "attraction") {
            return {
                name: formData.name || "",
                imgaeUrl: formData.imgaeUrl || "",
                location: formData.location ? [formData.location] : [],
                description: formData.description || "",
                entryFee: formData.entryFee ? Number(formData.entryFee) : 0,
            };
        } else if (type === "restaurant") {
            return {
                name: formData.name || "",
                imgaeUrl: formData.imgaeUrl || "",
                location: formData.location ? [formData.location] : [],
                description: formData.description || "",
                openingHours: formData.openingHours || "",
                closingHours: formData.closingHours || "",
                cuisineType: formData.cuisineType || "",
                contactInfo: formData.contactInfo || "",
            };
        }
        return {};
    };

    // ฟังก์ชัน submit form
    const handleSubmit = async () => {
        setSubmitCount((prev) => prev + 1); // update count ทุกครั้งที่กดปุ่ม
        setShowToast(true); // enable toast สำหรับรอบนี้

        if (!type) {
            alert("กรุณาเลือกประเภทข้อมูลก่อนส่ง");
            return;
        }
        setStatus("loading");
        try {
            const endpoint = `/places/${type}`;
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(getApiBody()),
            });
            if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการส่งข้อมูล");
            setStatus("success");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    // กำหนด fields ตามประเภท
    const getFieldsByType = () => {
        if (type === "accommodation") {
            return [
                { label: "ชื่อ", value: formData.name || "", id: "name" },
                { label: "ลิงก์รูปภาพ", value: formData.imgaeUrl || "", id: "imgaeUrl" },
                { label: "ที่อยู่", value: formData.location || "", id: "location" },
                { label: "คำอธิบาย", value: formData.description || "", id: "description" },
                { label: "สิ่งอำนวยความสะดวก", value: formData.facilities || "", id: "facilities" },
                { label: "ดาว", value: formData.starRating || "", id: "starRating" },
                { label: "ลิงก์ Redirect", value: formData.redirectUrl || "", id: "redirectUrl" },
            ];
        } else if (type === "attraction") {
            return [
                { label: "ชื่อ", value: formData.name || "", id: "name" },
                { label: "ลิงก์รูปภาพ", value: formData.imgaeUrl || "", id: "imgaeUrl" },
                { label: "ที่อยู่", value: formData.location || "", id: "location" },
                { label: "คำอธิบาย", value: formData.description || "", id: "description" },
                { label: "ค่าเข้าชม", value: formData.entryFee || "", id: "entryFee" },
            ];
        } else if (type === "restaurant") {
            return [
                { label: "ชื่อ", value: formData.name || "", id: "name" },
                { label: "ลิงก์รูปภาพ", value: formData.imgaeUrl || "", id: "imgaeUrl" },
                { label: "ที่อยู่", value: formData.location || "", id: "location" },
                { label: "คำอธิบาย", value: formData.description || "", id: "description" },
                { label: "เวลาเปิด", value: formData.openingHours || "", id: "openingHours" },
                { label: "เวลาปิด", value: formData.closingHours || "", id: "closingHours" },
                { label: "ประเภทอาหาร", value: formData.cuisineType || "", id: "cuisineType" },
                { label: "ข้อมูลติดต่อ", value: formData.contactInfo || "", id: "contactInfo" },
            ];
        }
        return [];
    };

    // useEffect จะทำงานทุกครั้งที่กดปุ่มบันทึก
    useEffect(() => {
        if (!showToast) return; // skip ถ้าไม่เปิด flag
        if (submitCount === 0) return; // skip ครั้งแรกตอนโหลดหน้า

        if (status === "success") {
            toast.success("บันทึกสำเร็จ!");
            setShowToast(false); // ปิด flag หลังโชว์ toast
        } else if (status === "error") {
            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
            setShowToast(false); // ปิด flag หลังโชว์ toast
        }
    }, [submitCount, status, showToast]);

    return (
        <div className="w-screen py-20 px-6 sm:px-20 flex flex-col gap-12 justify-center items-center">
            <h1 className="text-2xl font-semibold w-full max-w-5xl">เพิ่มข้อมูลสถานที่</h1>

            {/* เลือกประเภทข้อมูล */}
            <div className="w-full max-w-5xl">
                <ReusableSelect
                    label="เลือกประเภทข้อมูล"
                    placeholder="ที่พัก / สถานที่ท่องเที่ยว / ร้านอาหาร"
                    options={[
                        { value: "accommodation", label: "ที่พัก" },
                        { value: "attraction", label: "สถานที่ท่องเที่ยว" },
                        { value: "restaurant", label: "ร้านอาหาร" },
                    ]}
                    value={type}
                    onChange={setType}
                />
            </div>

            {/* ฟอร์มตามประเภท */}
            {type && (
                <div className="flex flex-col gap-12 w-full max-w-5xl">
                    <FormSection
                        title="กรอกข้อมูล"
                        description={`กรอกข้อมูลสำหรับประเภท ${typeLabelMap[type] || type}`}
                        fields={getFieldsByType()}
                        onChange={handleInputChange}
                    />

                    {/* ปุ่มบันทึก */}
                    <div className="flex justify-end gap-4">
                        <div className="flex gap-4">
                            <Button variant="outline" onClick={() => setFormData({})}>
                                ยกเลิก
                            </Button>
                            <Button onClick={handleSubmit}>{status === "loading" ? "กำลังบันทึก..." : "บันทึก"}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
