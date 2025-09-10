import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signin() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            {/* Background Glow Circle */}

            {/* Content */}
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>สร้างบัญชีใหม่เพื่อเริ่มต้นการใช้งาน 🚀</CardTitle>
                    <CardDescription>สมัครสมาชิกเพื่อเข้าถึงฟีเจอร์พิเศษและเก็บข้อมูลของคุณ</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">ชื่อผู้ใช้ (Username)</Label>
                                <Input id="name" type="text" placeholder="กรอกชื่อผู้ใช้ เช่น namth_99" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">อีเมล (Email)</Label>
                                <Input id="email" type="email" placeholder="example@email.com" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">รหัสผ่าน (Password)</Label>
                                <Input id="password" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">ยืนยันรหัสผ่าน (Confirm Password)</Label>
                                <Input id="password" type="password" placeholder="พิมพ์รหัสผ่านอีกครั้ง" required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                    <Button type="submit" className="w-full text-sm">
                        สมัครสมาชิก
                    </Button>
                    <div className="flex justify-center items-center gap-2 text-sm">
                        มีบัญชีแล้ว?  
                        <a href="#" className="ml-auto text-sm text-black no-underline">
                            เข้าสู่ระบบ
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
