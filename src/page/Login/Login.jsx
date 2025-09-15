import BackgroundBlurs from "@/components/BackgroundBlurs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useState } from "react";
import "../global.css";

const LOGIN_ENDPOINT = "/auth/login";

export default function Login() {
    // State สำหรับเก็บข้อมูลฟอร์ม
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // State สำหรับจัดการสถานะของ API
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ฟังก์ชันสำหรับส่งคำร้องเข้าสู่ระบบ
    const handleLogin = async (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้า
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(LOGIN_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }), // request_body
            });

            // ตรวจสอบว่า response ok หรือไม่
            if (!res.ok) {
                // ดึงข้อความ error จาก API
                const errorData = await res.json();
                throw new Error(errorData.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ ❌");
            }

            const data = await res.json(); // parse response JSON

            setSuccess("เข้าสู่ระบบสำเร็จ 🎉");
            console.log("API Response:", data);
        } catch (err) {
            setError(err.message); // แสดงข้อความ error
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center background">
            {/* Background Glow Circle */}
            {/* <BackgroundBlurs /> */}

            {/* Content */}
            <Card className="w-full max-w-sm z-10">
                <CardHeader>
                    <CardTitle>ยินดีต้อนรับกลับมา 👋</CardTitle>
                    <CardDescription>กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">อีเมล (Email)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">รหัสผ่าน (Password)</Label>
                                    <a href="#" className="ml-auto text-sm text-black no-underline hover:underline">
                                        ลืมรหัสผ่าน?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="อย่างน้อย 8 ตัวอักษร"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* แสดงสถานะ Loading / Error / Success */}
                        {loading && <p className="mt-3 text-sm text-blue-500">กำลังเข้าสู่ระบบ...</p>}
                        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                        {success && <p className="mt-3 text-sm text-green-500">{success}</p>}
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                    <Button
                        type="submit"
                        className="w-full text-sm bg-gradient-to-l from-[#FF7474] to-[#FF9F43]"
                        onClick={handleLogin} // เรียก API เมื่อกดปุ่ม
                        disabled={loading} // ป้องกันการกดซ้ำ
                    >
                        เข้าสู่ระบบ
                    </Button>
                    <Button variant="outline" className="w-full">
                        เข้าสู่ระบบด้วย ชื่อผู้ใช้
                    </Button>
                    <div className="flex justify-center items-center pt-3 gap-2 text-sm">
                        ยังไม่มีบัญชี?
                        <a href="/signin" className="ml-auto text-sm text-black no-underline hover:underline">
                            สมัครสมาชิก
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
