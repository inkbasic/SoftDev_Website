import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
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
import { BanknoteArrowDown } from "lucide-react";

// ---------- ค่าคงที่และยูทิล ----------
const API_BASE = import.meta.env.VITE_API_BASE_URL || ""; // เช่น https://api.example.com
const API_ENDPOINT = "/ad"; // ตามสเปกที่ให้มา
const MONGO_ID_RX = /^[a-f0-9]{24}$/i;

// ฟังก์ชันฟอร์แมตวันหมดอายุอ่านง่าย
const formatISO = (iso) => {
    try {
        return new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(iso));
    } catch {
        return iso || "-";
    }
};

// ---------- คอมโพเนนต์หลัก ----------
/**
 * DialogPayment
 * - รับ prop เดียวคือ placeId
 * - เปิด Dialog เพื่อให้ผู้ใช้กรอกข้อมูลบัตร/ราคา/วัน แล้วยิง POST /ad
 * - จัดการสถานะ loading / error / success
 */
export default function DialogPayment({ placeId }) {
    // ฟอร์มและสถานะต่าง ๆ
    const [method, setMethod] = useState("Credit Card"); // สเปกกำหนดให้ส่ง "Credit Card"
    const [durationDays, setDurationDays] = useState(5); // ดีฟอลต์ตามตัวอย่างสเปก
    const [price, setPrice] = useState(5000);

    const [holder, setHolder] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");

    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [result, setResult] = useState(null); // เก็บ response 201
    const [open, setOpen] = useState(false);

    // เตือนถ้า placeId ไม่ใช่ MongoId (ช่วยจับ 400 ล่วงหน้า)
    const invalidPlaceId = useMemo(() => !placeId || !MONGO_ID_RX.test(placeId), [placeId]);

    // เคลียร์สถานะเมื่อปิด/เปิด dialog ใหม่
    useEffect(() => {
        if (!open) {
            setErrMsg("");
            setResult(null);
            setLoading(false);
        }
    }, [open]);

    // ดึง JWT จาก localStorage แบบเมโม (ลดอ่านซ้ำ ๆ)
    const jwtToken = useMemo(() => localStorage.getItem("jwtToken") || "", []);

    // ---------- ยิง API ----------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg("");
        setResult(null);

        // ตรวจความถูกต้องเบื้องต้น
        if (invalidPlaceId) {
            setErrMsg("placeId ไม่ถูกต้อง (ต้องเป็น MongoId 24 ตัวอักษรฐาน 16)");
            return;
        }
        if (!jwtToken) {
            setErrMsg("ไม่พบโทเค็นสำหรับยืนยันตัวตน โปรดเข้าสู่ระบบอีกครั้ง");
            return;
        }
        if (!holder || !email || !number || !expiry || !cvc) {
            setErrMsg("กรุณากรอกข้อมูลบัตรให้ครบถ้วน");
            return;
        }
        if (!durationDays || durationDays <= 0) {
            setErrMsg("จำนวนวันต้องมากกว่า 0");
            return;
        }
        if (!price || price <= 0) {
            setErrMsg("ราคา/Amount ต้องมากกว่า 0");
            return;
        }

        setLoading(true);

        // สร้าง payload ตรงตามสเปก
        const payload = {
            placeId: placeId,
            durationDays: Number(durationDays),
            price: Number(price),
            transaction: {
                method,
                cardInfo: {
                    holder,
                    email,
                    number,
                    expiry,
                    cvc,
                },
            },
        };

        try {
            const res = await fetch(`${API_BASE}${API_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`, // ตามสเปก
                },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            let data = null;
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch {
                    // ถ้าไม่ใช่ JSON ก็ปล่อยเป็น null
                }
            }

            if (!res.ok) {
                // รองรับโครงสร้าง error 400 ที่ให้มา
                if (res.status === 400 && data?.message) {
                    // message อาจเป็น array ของข้อความ validate
                    const msg =
                        Array.isArray(data.message) && data.message.length
                            ? data.message.join(", ")
                            : data.message || "Bad Request";
                    throw new Error(msg);
                }
                throw new Error(data?.error || data?.message || `Server error (status ${res.status})`);
            }

            // สำเร็จ (คาดหวัง 201 + data object)
            setResult(data?.data || null);
        } catch (err) {
            setErrMsg(err?.message || "เกิดข้อผิดพลาดในการส่งคำขอ");
        } finally {
            setLoading(false);
        }
    };

    // ---------- UI ผลลัพธ์หลังสร้างสำเร็จ ----------
    const SuccessView = () => {
        if (!result) return null;
        return (
            <div className="p-4 space-y-2 border rounded-2xl bg-green-50">
                <p className="font-semibold">สร้างโฆษณาสำเร็จ 🎉</p>
                <div className="grid gap-1 text-sm">
                    <div>
                        <span className="font-medium">Ad ID:</span> {result.id}
                    </div>
                    <div>
                        <span className="font-medium">Provider:</span> {result.providerId}
                    </div>
                    <div>
                        <span className="font-medium">Place:</span> {result.placeId}
                    </div>
                    <div>
                        <span className="font-medium">สถานะ:</span> {result.status}
                    </div>
                    <div>
                        <span className="font-medium">จำนวนวัน:</span> {result.durationDays}
                    </div>
                    <div>
                        <span className="font-medium">ราคา:</span> {Number(result.price).toLocaleString()}
                    </div>
                    <div>
                        <span className="font-medium">หมดอายุ:</span> {formatISO(result.expireAt)}
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => navigator.clipboard?.writeText(result.id)}>
                        คัดลอก Ad ID
                    </Button>
                    <Button type="button" onClick={() => setOpen(false)}>
                        ปิดหน้าต่าง
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                    <BanknoteArrowDown className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="w-xs sm:w-md">
                <DialogHeader>
                    <DialogTitle>ชำระเงินเพื่อสร้างโฆษณา</DialogTitle>
                    <DialogDescription>ระบุจำนวนวัน, ราคา และข้อมูลบัตร</DialogDescription>
                </DialogHeader>

                {/* ถ้าสำเร็จแล้ว แสดงสรุป และซ่อนฟอร์ม */}
                {result ? (
                    <SuccessView />
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-5">
                        {/* ข้อมูล Ad */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>จำนวนวัน (durationDays)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={durationDays}
                                    onChange={(e) => setDurationDays(Number(e.target.value))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>ราคา (price)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* วิธีชำระเงิน */}
                        <div className="grid gap-2">
                            <Label>วิธีการชำระเงิน</Label>
                            <Select value={method} onValueChange={setMethod}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="เลือกวิธีการชำระเงิน" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Credit Card">บัตรเครดิต/เดบิต</SelectItem>
                                        {/* รองรับการขยายในอนาคต แต่สเปกตอนนี้ต้องส่ง 'Credit Card' */}
                                        <SelectItem value="PromptPay" disabled>
                                            PromptPay (ปิดไว้)
                                        </SelectItem>
                                        <SelectItem value="Wallet" disabled>
                                            Wallet (ปิดไว้)
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* ข้อมูลบัตร */}
                        <div className="grid gap-3">
                            <Label>ข้อมูลบัตร</Label>
                            <div className="grid gap-3 pt-2">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="holder">ชื่อบนบัตร</Label>
                                        <Input
                                            id="holder"
                                            placeholder="John Doe"
                                            value={holder}
                                            onChange={(e) => setHolder(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="email">อีเมลสำหรับใบเสร็จ</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="number">เลขบัตร</Label>
                                        <Input
                                            id="number"
                                            inputMode="numeric"
                                            placeholder="4111 1111 1111 1111"
                                            value={number}
                                            onChange={(e) => setNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="expiry">MM/YY</Label>
                                            <Input
                                                id="expiry"
                                                placeholder="12/26"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input
                                                id="cvc"
                                                inputMode="numeric"
                                                placeholder="123"
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* สถานะ */}
                        {loading && <p className="text-sm text-blue-600">กำลังดำเนินการ...</p>}
                        {errMsg && <p className="text-sm text-red-600">{errMsg}</p>}

                        <DialogFooter className="flex gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    ยกเลิก
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {loading ? "กำลังชำระเงิน..." : "ยืนยันการชำระเงิน"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

DialogPayment.propTypes = {
    // ต้องส่งเข้ามาเสมอ และเป็น MongoId 24 ตัว
    placeId: PropTypes.string.isRequired,
};
