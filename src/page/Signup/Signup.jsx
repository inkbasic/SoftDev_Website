import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import "../global.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:3000";
const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register`;

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: "",
        phoneNumber: "",
        isProvider: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("jwtToken");
        if (token) navigate("/", { replace: true });
    }, [navigate]);

    useEffect(() => {
        if (formData.password && formData.confirmPassword) {
            setPasswordMatch(formData.password === formData.confirmPassword);
        } else {
            setPasswordMatch(true);
        }
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!passwordMatch) {
            setError("รหัสผ่านไม่ตรงกัน ❌");
            return;
        }
        
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const dataToSubmit = { ...formData };
            delete dataToSubmit.confirmPassword;

            const res = await fetch(REGISTER_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก ❌");
            }

            const data = await res.json();
            
            if (data.token) {
                Cookies.set("jwtToken", data.token, { expires: 7, secure: true, sameSite: 'strict' });
                
                const user = {
                    userName: formData.userName,
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    profileImage: formData.profileImage,
                };
                
                Cookies.set("user", JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
                Cookies.set("name", `${formData.firstName} ${formData.lastName}`, { expires: 7, secure: true, sameSite: 'strict' });
                Cookies.set("email", formData.email, { expires: 7, secure: true, sameSite: 'strict' });
                Cookies.set("profileImage", formData.profileImage, { expires: 7, secure: true, sameSite: 'strict' });
                Cookies.set("username", formData.userName, { expires: 7, secure: true, sameSite: 'strict' });
            }

            setSuccess("สมัครสมาชิกสำเร็จ 🎉");
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center background h-full">
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
                                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน (Confirm Password)</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={!passwordMatch ? "border-red-500" : ""}
                                />
                                {!passwordMatch && (
                                    <p className="text-xs text-red-500 mt-1">รหัสผ่านไม่ตรงกัน</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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

                            <div className="flex gap-2">
                                <Label htmlFor="isProvider">สมัครเป็นผู้ให้บริการ (Service Provider)</Label>
                                <input
                                    id="isProvider"
                                    type="checkbox"
                                    checked={formData.isProvider}
                                    onChange={(e) => setFormData({ ...formData, isProvider: e.target.checked })}
                                />
                            </div>
                        </div>

                        {loading && <p className="mt-3 text-sm text-blue-500">กำลังสมัครสมาชิก...</p>}
                        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                        {success && <p className="mt-3 text-sm text-green-500">{success}</p>}
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-3">
                    <Button
                        type="submit"
                        className="w-full text-sm bg-gradient-to-l from-[#FF7474] to-[#FF9F43] hover:cursor-pointer"
                        onClick={handleSubmit}
                        disabled={loading || !passwordMatch}
                    >
                        สมัครสมาชิก
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm">
                        มีบัญชีแล้ว?
                        <a href="/login" className="!px-0 ml-auto text-sm underline text-[#ff7474] hover:underline">
                            เข้าสู่ระบบ
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}