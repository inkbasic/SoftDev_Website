import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Ellipsis } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Dialog
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

export function DialogSubscription() {
    return (
        <Dialog>
            <form>
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
                    <div className="grid gap-4">
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
                                <Input
                                    id="expiration_date"
                                    name="expiration_date"
                                    placeholder="MM/YY"
                                    className="w-30"
                                />
                                <Input id="cvv" name="cvv" placeholder="CVC" className="w-20" />
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="number-1">วิธีการชำระเงิน</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="เช่น บัตรเครดิต / เดบิต" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="card">บัตรเครดิต / เดบิต</SelectItem>
                                        <SelectItem value="promptPay">PromptPay / QR Payment</SelectItem>
                                        <SelectItem value="wallet">Wallet</SelectItem>
                                        <SelectItem value="payPal">PayPal</SelectItem>
                                        <SelectItem value="trueMoney">TrueMoney</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">ยกเลิก</Button>
                        </DialogClose>
                        <Button type="submit">อัพเกรดแผน</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

export default function Profile() {
    return (
        <div className="w-screen py-20 px-6 flex flex-col gap-12 justify-center items-center">
            <header className="flex justify-between items-center w-full max-w-5xl">
                <div className="flex sm:flex-row gap-4 lg:gap-7">
                    <Avatar className="size-[50px] lg:size-[150px]">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center lg:gap-2">
                        <h1 className="text-sm lg:text-2xl font-semibold">ชื่อผู้ใช้</h1>
                        <p className="text-sm lg:text-base text-neutral-500">ไบโอของผู้ใช้</p>
                    </div>
                </div>
                <div className="flex gap-1 lg:gap-4 items-center">
                    <Button variant="outline" size="icon" className="size-9 lg:hidden">
                        <Ellipsis />
                    </Button>
                    <Button variant="outline" size="icon" className="size-9 hidden lg:flex">
                        <Settings />
                    </Button>
                    <Button variant="outline" className="px-6 hidden lg:flex">
                        แก้ไข
                    </Button>
                </div>
            </header>

            {/* user detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
                <Card className="p-6">
                    <h2 className="text-2xl">เกี่ยวกับฉัน</h2>
                    <p className="text-base">
                        สวัสดีค่ะ ฉันชอบการท่องเที่ยว ถ่ายภาพ และอ่านหนังสือแนวจิตวิทยา กำลังเรียนรู้การพัฒนาเว็บด้วย
                        Next.js และ TailwindCSS สนใจเรื่องพลังงานและโหราศาสตร์
                    </p>
                    <Separator />
                    <h2 className="text-2xl">ความสนใจ</h2>
                    <ul class="list-disc list-inside">
                        <li>เทคโนโลยี & การเขียนโค้ด</li>
                        <li>จักรวาล & ดวงดาว</li>
                        <li>การเดินทาง & ไลฟ์สไตล์</li>
                        <li>หนังสือจิตวิทยา</li>
                    </ul>
                </Card>
                <Card className="p-6 gap-3">
                    <h4>ชื่อ-นามสกุล</h4>
                    <p className="text-sm text-neutral-500">สุภัสสรา มีแก้ว</p>
                    <h4>เบอร์โทรศัพท์</h4>
                    <p className="text-sm text-neutral-500">089-123-4567</p>
                    <h4>อีเมล</h4>
                    <p className="text-sm text-neutral-500">supassara.m@example.com</p>
                    <h4>โซเชียลมีเดีย</h4>
                    <p className="text-sm text-neutral-500">Facebook: facebook.com/namth</p>
                    <p className="text-sm text-neutral-500">Instagram: @namth_earthtone</p>
                    <p className="text-sm text-neutral-500">Twitter/X: @namth_dev</p>
                </Card>
            </div>

            {/* Billing & Subscription */}
            <div className="flex flex-col w-full max-w-5xl gap-12">
                <h1 className="text-2xl font-semibold">Billing & Subscription</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
                    <Card className="p-6 gap-4 justify-between">
                        <h2 className="text-2xl font-semibold">Free Plan</h2>
                        <div>
                            <p>ฟีเจอร์:</p>
                            <ul class="list-disc list-inside">
                                <li>ใช้งานพื้นฐานได้ไม่จำกัด</li>
                                <li>เข้าถึงเนื้อหาทั่วไป</li>
                                <li>จำกัดการดาวน์โหลด 5 ครั้ง/วัน</li>
                            </ul>
                        </div>
                        <h2 className="text-2xl font-semibold">
                            0 บาท <span className="text-base text-neutral-500 font-medium">/เดือน</span>
                        </h2>
                        <Button variant="outline">ตอนนี้คุณอยู่ในแผนนี้</Button>
                    </Card>
                    <Card className="p-6 gap-4 justify-between">
                        <h2 className="text-2xl font-semibold">Basic Plan</h2>
                        <div>
                            <p>ฟีเจอร์:</p>
                            <ul class="list-disc list-inside">
                                <li>ใช้งานได้ทุกฟังก์ชัน</li>
                                <li>จัดเก็บข้อมูลสูงสุด 10GB</li>
                                <li>รองรับการเชื่อมต่ออุปกรณ์ 2 เครื่อง</li>
                            </ul>
                        </div>
                        <h2 className="text-2xl font-semibold">
                            199 บาท <span className="text-base text-neutral-500 font-medium">/เดือน</span>
                        </h2>
                        <DialogSubscription />
                    </Card>
                    <Card className="p-6 gap-4 justify-between">
                        <h2 className="text-2xl font-semibold">Pro Plan</h2>
                        <div>
                            <p>ฟีเจอร์:</p>
                            <ul class="list-disc list-inside">
                                <li>จัดเก็บข้อมูลสูงสุด 100GB</li>
                                <li>รองรับการเชื่อมต่ออุปกรณ์ 5 เครื่อง</li>
                                <li>Priority Support ตลอด 24 ชม.</li>
                                <li>ฟีเจอร์พิเศษด้านการวิเคราะห์</li>
                            </ul>
                        </div>
                        <h2 className="text-2xl font-semibold">
                            499 บาท <span className="text-base text-neutral-500 font-medium">/เดือน</span>
                        </h2>
                        <DialogSubscription />
                    </Card>
                </div>
            </div>
        </div>
    );
}
