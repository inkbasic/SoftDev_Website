// DeleteAdDialog.jsx
// คอมโพเนนต์สำหรับลบโฆษณา (Ad) ด้วย DELETE /ad/{adId}
// ลดจำนวน Props: รับเฉพาะ adId (จำเป็น) — ค่าอื่นกำหนดในไฟล์นี้

import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

// shadcn/ui
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

/* =========================
   การตั้งค่าภายในไฟล์ (ไม่ต้องส่งเป็นพร็อพ)
   ========================= */

// Base endpoint สำหรับลบโฆษณา
const ENDPOINT_BASE = import.meta.env.VITE_PUBLIC_API_URL+"/ad";

// แหล่ง JWT: ENV (Vite) → localStorage → ค่า fallback (ตัวอย่าง)
// หมายเหตุ: ในโปรดักชันควรหลีกเลี่ยง fallback ฮาร์ดโค้ด
const JWT_TOKEN =
    import.meta.env?.VITE_JWT_TOKEN ||
    (typeof window !== "undefined" && window.localStorage ? localStorage.getItem("jwtToken") : null) ||
    "jwtToken";

// ป้ายบนปุ่มเปิดไดอะล็อก (ใช้ไอคอนแทนข้อความ)
const TRIGGER_LABEL = "ลบโฆษณา";

/**
 * DeleteAdDialog
 * - เปิดไดอะล็อกเพื่อยืนยันการลบ
 * - เรียก DELETE /ad/{adId} พร้อม Header Authorization: Bearer <jwt>
 * - แสดงสถานะ โหลด/สำเร็จ/ผิดพลาด
 * - ปิดไดอะล็อกอัตโนมัติเมื่อสำเร็จ และยิง CustomEvent ("ad-deleted")
 */
export default function DeleteAdDialog({ adId }) {
    // คุมการเปิด/ปิดภายในคอมโพเนนต์
    const [open, setOpen] = useState(false);

    // สถานะ API
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    // เก็บ AbortController เพื่อยกเลิกคำขอเมื่อผู้ใช้ปิดไดอะล็อก
    const abortRef = useRef(null);

    // ประกอบ URL ให้สะอาด (ตัด / เกิน)
    const endpoint = useMemo(() => {
        const base = ENDPOINT_BASE.replace(/\/+$/, "");
        const id = String(adId).replace(/^\/+/, "");
        return `${base}/${id}`;
    }, [adId]);

    // รีเซ็ตสถานะทุกครั้งที่เปิดใหม่ และยกเลิกคำขอที่ค้างอยู่
    useEffect(() => {
        if (open) {
            setError("");
            setResult(null);
            if (abortRef.current) {
                abortRef.current.abort();
                abortRef.current = null;
            }
        }
    }, [open]);

    // เมื่อเปลี่ยนสถานะเปิด/ปิด: ยกเลิกคำขอที่ค้าง (กัน memory leak)
    const handleOpenChange = (nextOpen) => {
        if (!nextOpen && abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
            setIsDeleting(false);
        }
        setOpen(nextOpen);
    };

    // ฟังก์ชันลบโฆษณา
    const handleDelete = async () => {
        if (!adId && adId !== 0) {
            setError("ไม่พบ adId สำหรับลบ");
            return;
        }
        if (!JWT_TOKEN) {
            setError("ไม่พบโทเคนยืนยันตัวตน (JWT)");
            return;
        }

        setIsDeleting(true);
        setError("");
        setResult(null);

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const res = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${JWT_TOKEN}`,
                    Accept: "application/json",
                },
                signal: controller.signal,
            });

            // รองรับทั้งกรณีมี/ไม่มี body (เช่น 204)
            let payload = null;
            const text = await res.text();
            if (text) {
                try {
                    payload = JSON.parse(text);
                } catch {
                    payload = { raw: text };
                }
            }

            if (!res.ok) {
                const msg = (payload && (payload.message || payload.error)) || `ลบไม่สำเร็จ (HTTP ${res.status})`;
                throw new Error(msg);
            }

            // ผลลัพธ์ตามสัญญาข้อมูลโจทย์:
            // { "message": "Ad deleted successfully" }
            setResult(payload || { message: "Ad deleted successfully" });

            // ปิดไดอะล็อกอัตโนมัติเมื่อสำเร็จ
            setOpen(false);

            // แจ้งส่วนอื่นของแอปว่าลบสำเร็จ (optional)
            // สามารถให้หน้า List ไปฟัง event นี้แล้วรีเฟรชข้อมูล
            window.dispatchEvent(new CustomEvent("ad-deleted", { detail: { adId } }));
        } catch (err) {
            if (err?.name === "AbortError") return; // ผู้ใช้ยกเลิก
            setError(err?.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
        } finally {
            setIsDeleting(false);
            abortRef.current = null;
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" aria-label={TRIGGER_LABEL} title={TRIGGER_LABEL}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>ยืนยันการลบโฆษณา</AlertDialogTitle>
                    <AlertDialogDescription>
                        การลบนี้ไม่สามารถย้อนกลับได้ ระบบจะส่งคำสั่ง <code>DELETE {endpoint}</code> พร้อมหัวข้อ{" "}
                        <code>Authorization: Bearer &lt;jwt&gt;</code>.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="my-2 space-y-2">
                    {isDeleting && <div className="text-sm opacity-80">กำลังลบ… โปรดรอสักครู่</div>}

                    {!!error && (
                        <div className="p-2 text-sm border rounded-md border-destructive/40 bg-destructive/10">
                            <b>ลบไม่สำเร็จ:</b> {error}
                        </div>
                    )}

                    {result && !error && (
                        <div className="p-2 text-sm border rounded-md">
                            <b>ผลลัพธ์จาก API:</b>
                            <pre className="mt-1 overflow-auto text-xs max-h-40">{JSON.stringify(result, null, 2)}</pre>
                        </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                        กำลังจะลบ: <code>adId={String(adId)}</code>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "กำลังลบ..." : "ยืนยันการลบ"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

DeleteAdDialog.propTypes = {
    adId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
