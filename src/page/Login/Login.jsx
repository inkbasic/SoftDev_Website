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

export default function Login() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            {/* Background Glow Circle */}

            {/* Content */}
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>ยินดีต้อนรับกลับมา 👋</CardTitle>
                    <CardDescription>กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">อีเมล (Email)</Label>
                                <Input id="email" type="email" placeholder="example@email.com" required />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">รหัสผ่าน (Password)</Label>
                                    <a href="#" className="ml-auto text-sm text-black no-underline">
                                        ลืมรหัสผ่าน?
                                    </a>
                                </div>
                                <Input id="password" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                    <Button type="submit" className="w-full text-sm">
                        เข้าสู่ระบบ
                    </Button>
                    <Button variant="outline" className="w-full">
                        เข้าสู่ระบบด้วย ชื่อผู้ใช้
                    </Button>
                    <div className="flex justify-center items-center gap-2 text-sm">
                        ยังไม่มีบัญชี? 
                        <a href="#" className="ml-auto text-sm text-black no-underline">
                            สมัครสมาชิก
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
