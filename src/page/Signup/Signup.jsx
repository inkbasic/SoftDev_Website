import BackgroundBlurs from "@/components/BackgroundBlurs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useNavigate } from "react-router-dom";
import "../global.css";
import React, { useState, useEffect } from "react";

const REGISTER_ENDPOINT = "/auth/register";

export default function Signin() {
    // State สำหรับฟอร์ม
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        profileImage: "",
        phoneNumber: "",
    });

    // State สำหรับสถานะ API
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    // ถ้ามี token อยู่แล้ว ให้เด้งไป home
    useEffect(() => {
        const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
        if (token) navigate("/", { replace: true });
    }, [navigate]);

    // ฟังก์ชันจัดการการเปลี่ยนแปลงค่าในฟอร์ม
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // ฟังก์ชันส่งฟอร์มไปยัง API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(REGISTER_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // แปลง formData เป็น JSON string
            });

            // ตรวจสอบว่า response status เป็น OK หรือไม่
            if (!res.ok) {
                const errorData = await res.json(); // ดึงข้อมูล error จาก API
                throw new Error(errorData.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก ❌");
            }

            const data = await res.json(); // parse response JSON

            setSuccess("สมัครสมาชิกสำเร็จ 🎉");
            console.log("API Response:", data);

            // ✅ นำทางทันทีหลัง login
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message); // แสดงข้อความ error
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-20 background">
            {/* Background Glow Circle */}
            {/* <BackgroundBlurs /> */}

            {/* Content */}
            <Card className="z-10 w-full max-w-sm">
                <CardHeader>
                    <CardTitle>สร้างบัญชีใหม่เพื่อเริ่มต้นการใช้งาน 🚀</CardTitle>
                    <CardDescription>สมัครสมาชิกเพื่อเข้าถึงฟีเจอร์พิเศษและเก็บข้อมูลของคุณ</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="userName">ชื่อผู้ใช้ (Username)</Label>
                                <Input
                                    id="userName"
                                    type="text"
                                    placeholder="กรอกชื่อผู้ใช้ เช่น namth_99"
                                    required
                                    value={formData.userName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">อีเมล (Email)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">รหัสผ่าน (Password)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="อย่างน้อย 8 ตัวอักษร"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="firstName">ชื่อจริง (First Name)</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="ชื่อจริง"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="lastName">นามสกุล (Last Name)</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="นามสกุล"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phoneNumber">เบอร์โทรศัพท์ (Phone Number)</Label>
                                <Input
                                    id="phoneNumber"
                                    type="text"
                                    placeholder="เช่น 0812345678"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="profileImage">URL รูปโปรไฟล์ (Profile Image)</Label>
                                <Input
                                    id="profileImage"
                                    type="text"
                                    placeholder="วาง URL ของรูปภาพ"
                                    value={formData.profileImage}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* แสดงสถานะ Loading / Error / Success */}
                        {loading && <p className="mt-3 text-sm text-blue-500">กำลังสมัครสมาชิก...</p>}
                        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                        {success && <p className="mt-3 text-sm text-green-500">{success}</p>}
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-3">
                    <Button
                        type="submit"
                        className="w-full text-sm bg-gradient-to-l from-[#FF7474] to-[#FF9F43]"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        สมัครสมาชิก
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm">
                        มีบัญชีแล้ว?
                        <a href="/login" className="!px-0 ml-auto text-sm text-black no-underline  hover:underline">
                            เข้าสู่ระบบ
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
