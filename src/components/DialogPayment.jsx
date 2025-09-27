import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const PAYMENT_ENDPOINT = "/ads/transaction";

// ✅ Component หลัก
export default function DialogPayment() {
    // จัดการ state
    const [method, setMethod] = useState("card"); // ค่า default = PromptPay
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ฟังก์ชันเรียก API
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("👉 เริ่มส่ง request ไปที่ server");

        // ถ้ามี state เหล่านี้อยู่ ให้ตั้งค่าเริ่มต้นก่อนยิง API
        setLoading?.(true);
        setError?.("");
        setSuccess?.("");

        // ดึงค่าจากฟอร์ม
        const fd = new FormData(e.currentTarget);
        const payload = {
            // ค่าจากฟอร์ม
            name: fd.get("name")?.toString().trim(),
            email: fd.get("email")?.toString().trim(),
            card_number: fd.get("card_number")?.toString().trim(),
            expiration_date: fd.get("expiration_date")?.toString().trim(),
            cvv: fd.get("cvv")?.toString().trim(),
            method: (typeof method !== "undefined" && method) || fd.get("method")?.toString() || "",

            // hardcoded values
            adType: "banner",
            adDuration: "30days",
            amount: 299,
        };

        try {
            // ดึง JWT token จาก localStorage (หรือที่คุณเก็บไว้)
            const jwtToken = localStorage.getItem("jwtToken");
            if (!jwtToken) {
                throw new Error("ไม่พบโทเค็นสำหรับยืนยันตัวตน โปรดเข้าสู่ระบบอีกครั้ง");
            }

            const res = await fetch(PAYMENT_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`, // แนบ JWT
                },
                body: JSON.stringify({
                    adType: "CarRental",
                    adDuration: 7,
                    amount: 50,
                    method: "PromptPay",
                }),
            });

            console.log("📡 Response status:", res.status);

            // ป้องกันกรณี response ไม่มี body หรือไม่ใช่ JSON
            let data = null;
            const text = await res.text();
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch {
                    data = null;
                }
            }
            console.log("📦 Response data:", data);

            if (!res.ok) {
                // พยายามดึงข้อความ error จาก body ถ้ามี
                const msg = (data && (data.message || data.error)) || `Server error (status ${res.status})`;
                throw new Error(`❌ ${msg}`);
            }

            // สำเร็จ
            setSuccess?.(data?.message || "ชำระเงินสำเร็จ 🎉");
        } catch (err) {
            console.error("⚠️ Error:", err);
            setError?.(err.message || "เกิดข้อผิดพลาดในการชำระเงิน");
        } finally {
            setLoading?.(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-l from-[#FF7474] to-[#FF9F43]">สมัครเลย</Button>
            </DialogTrigger>

            <DialogContent className="w-xs sm:w-md">
                <DialogHeader>
                    <DialogTitle>อัพเกรดการสมัครสมาชิก</DialogTitle>
                    <DialogDescription>
                        ขณะนี้คุณใช้แพ็กเกจฟรี อัปเกรดเป็นแพ็กเกจโปรเพื่อเข้าถึงฟีเจอร์ทั้งหมด
                    </DialogDescription>
                </DialogHeader>

                {/* ย้าย form มาอยู่ใน DialogContent */}
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">ชื่อบนบัตร</Label>
                        <Input id="name-1" name="name" placeholder="Somchai T." />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="email-1">อีเมล</Label>
                        <Input id="email-1" name="email" placeholder="example@acme.com" />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="number-1">เลขบัตร</Label>
                        <div className="flex gap-4">
                            <Input id="card_number" name="card_number" placeholder="1234 1234 1234 1234" />
                            <Input id="expiration_date" name="expiration_date" placeholder="MM/YY" className="w-30" />
                            <Input id="cvv" name="cvv" placeholder="CVC" className="w-20" />
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="payment-method">วิธีการชำระเงิน</Label>
                        <Select value={method} onValueChange={setMethod}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="เลือกวิธีการชำระเงิน" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="card">บัตรเครดิต / เดบิต</SelectItem>
                                    <SelectItem value="PromptPay">PromptPay / QR Payment</SelectItem>
                                    <SelectItem value="wallet">Wallet</SelectItem>
                                    <SelectItem value="PayPal">PayPal</SelectItem>
                                    <SelectItem value="TrueMoney">TrueMoney</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {/* ถ้าต้องการส่งค่า method ไปกับ FormData ด้วย ใส่ hidden ไว้ */}
                        <input type="hidden" name="method" value={method ?? ""} />
                    </div>

                    {/* สถานะ */}
                    {loading && <p className="mt-2 text-sm text-blue-600">กำลังดำเนินการ...</p>}
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    {success && <p className="mt-2 text-sm text-green-600">{success}</p>}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                ยกเลิก
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "กำลังชำระเงิน..." : "อัพเกรดแผน"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
