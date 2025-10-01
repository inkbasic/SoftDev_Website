// DeletePlaceDialog.jsx
// เวอร์ชันลดจำนวน Props: รับแค่ placeId (จำเป็น)
// ค่าอื่น ๆ ถูกกำหนดในไฟล์นี้โดยตรง

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
   การตั้งค่าภายในไฟล์ (ไม่มีเป็นพร็อพ)
   ========================= */

// Base endpoint สำหรับลบสถานที่
const ENDPOINT_BASE = "/places";

// JWT สามารถกำหนดแบบฮาร์ดโค้ดหรือดึงจากแหล่งเก็บภายในเบราว์เซอร์ได้
// ลำดับความสำคัญ: ENV (Vite) -> localStorage -> ค่าดีฟอลต์ (ตัวอย่าง)
const JWT_TOKEN =
    import.meta.env?.VITE_JWT_TOKEN ||
    (typeof window !== "undefined" && window.localStorage ? localStorage.getItem("jwtToken") : null) ||
    "jwtToken";

/**
 * DeletePlaceDialog (ลดพร็อพเหลือแค่ placeId)
 * - เปิดไดอะล็อกเพื่อยืนยันลบ
 * - ยิง DELETE /places/{id} พร้อม Authorization: Bearer <jwt>
 * - จัดการสถานะโหลด/สำเร็จ/ผิดพลาด
 */
export default function DeletePlaceDialog({ placeId }) {
    // คุมการเปิด/ปิดภายในคอมโพเนนต์ (uncontrolled)
    const [open, setOpen] = useState(false);

    // สถานะ API
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    // สำหรับยกเลิก fetch หากผู้ใช้ปิดไดอะล็อกระหว่างโหลด
    const abortRef = useRef(null);

    // ประกอบ URL ให้ปลอดภัยจาก / เกิน
    const endpoint = useMemo(() => {
        const base = ENDPOINT_BASE.replace(/\/+$/, "");
        const id = String(placeId).replace(/^\/+/, "");
        return `${base}/${id}`;
    }, [placeId]);

    // รีเซ็ตสถานะทุกครั้งที่เปิดใหม่ และยกเลิกคำขอเก่าถ้ามี
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

    // เมื่อเปลี่ยนสถานะเปิด/ปิด ให้ยกเลิกคำขอที่ค้าง (กัน memory leak)
    const handleOpenChange = (nextOpen) => {
        if (!nextOpen && abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
            setIsDeleting(false);
        }
        setOpen(nextOpen);
    };

    // ฟังก์ชันลบ
    const handleDelete = async () => {
        if (!placeId) {
            setError("ไม่มี placeId สำหรับลบ");
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
            console.log("endpoint : ", endpoint);

            const res = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${JWT_TOKEN}`,
                    Accept: "application/json",
                },
                signal: controller.signal,
            });

            // เผื่อกรณี 204 No Content
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

            setResult(payload || { message: "Deleted successfully." });

            // ปิดไดอะล็อกอัตโนมัติเมื่อสำเร็จ
            setOpen(false);

            // (ออปชัน) สามารถทำ side-effect ภายในได้ เช่น reload/refresh:
            // window.dispatchEvent(new CustomEvent("place-deleted", { detail: { placeId } }));
        } catch (err) {
            if (err?.name === "AbortError") return;
            setError(err?.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
        } finally {
            setIsDeleting(false);
            abortRef.current = null;
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                    <AlertDialogDescription>
                        การลบนี้ไม่สามารถย้อนกลับได้ ระบบจะส่งคำสั่ง <code>DELETE {endpoint}</code> พร้อม Header{" "}
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
                        กำลังจะลบ: <code>placeId={String(placeId)}</code>
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

DeletePlaceDialog.propTypes = {
    placeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
