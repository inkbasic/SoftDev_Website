import BackgroundBlurs from "@/components/BackgroundBlurs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../global.css";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:3000";
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;

export default function Login() {
    // State ฟอร์ม
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // State สถานะ API / UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ เติม state ที่ถูกเรียกใช้

    const navigate = useNavigate();

    // ถ้ามี token อยู่แล้ว ให้เด้งไป home
    useEffect(() => {
        const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
        if (token) navigate("/", { replace: true });
    }, [navigate]);

    // เข้าสู่ระบบ
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(LOGIN_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ ❌");
            }

            const data = await res.json();

            // เก็บ token/message
            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("loginMessage", data.message || "Login success");

            setSuccess("เข้าสู่ระบบสำเร็จ 🎉");
            setIsLoggedIn(true);

            // ✅ เรียก API /users เพื่อเอา _id
            await fetchUserId(data.token);

            // นำทาง
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ ❌");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันเรียก /users
    async function fetchUserId(token) {
        try {
            const res = await fetch("/users", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Cache-Control": "no-cache", // hint ฝั่ง client
                    Pragma: "no-cache", // เผื่อ proxy เก่า
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store", // สำคัญ: สั่ง fetch ไม่ใช้ cache
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || `${res.status} ${res.statusText}`);
            }

            const user = await res.json(); // ตอนนี้ควรได้ 200 + body
            if (user) {
                // ✅ แปลง object เป็น JSON string ก่อนเก็บ
                localStorage.setItem("user", JSON.stringify(user));

                // ถ้าอยากยังคงเก็บแค่ id แยกไว้ด้วยก็ได้
                localStorage.setItem("userId", user._id);

                console.log("เก็บ user ทั้ง object:", user);
            }
            
            return user;
        } catch (e) {
            console.error("fetchUserId failed:", e);
            return null;
        }
    }

    return (
        <div className="flex items-center justify-center h-screen background">
            {/* <BackgroundBlurs /> */}

            <Card className="z-10 w-full max-w-sm">
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
                                    <a
                                        href="#"
                                        className="!px-0 ml-auto text-sm text-black no-underline hover:underline"
                                    >
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

                        {/* สถานะ */}
                        {loading && <p className="mt-3 text-sm text-blue-500">กำลังเข้าสู่ระบบ...</p>}
                        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                        {success && <p className="mt-3 text-sm text-green-500">{success}</p>}

                        {/* ปุ่ม submit ในฟอร์ม (แนะนำให้มีปุ่มใน form ด้วย) */}
                        <button type="submit" className="hidden" aria-hidden="true" />
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-3">
                    <Button
                        type="button"
                        className="w-full text-sm bg-gradient-to-l from-[#FF7474] to-[#FF9F43]"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        เข้าสู่ระบบ
                    </Button>

                    <Button variant="outline" className="w-full">
                        เข้าสู่ระบบด้วย ชื่อผู้ใช้
                    </Button>

                    <div className="flex items-center justify-center gap-2 pt-3 text-sm">
                        ยังไม่มีบัญชี?
                        <a href="/signup" className="!px-0 ml-auto text-sm text-black no-underline hover:underline">
                            สมัครสมาชิก
                        </a>
                    </div>
                </CardFooter>
            </Card>
            {/* <Button
                type="button"
                className="w-auto text-sm bg-gradient-to-l from-[#FF7474] to-[#FF9F43]"
                onClick={fetchUserId}
            >
                fetchUserId
            </Button> */}
        </div>
    );
}
