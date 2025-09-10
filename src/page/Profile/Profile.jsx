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

function DialogSubscription() {
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

function SubscriptionCard({ title, features, price, per = "/เดือน", isCurrent = false, action }) {
    return (
        <Card className="p-6 gap-4 justify-between flex flex-col">
            <h2 className="text-2xl font-semibold">{title}</h2>

            <div>
                <p>ฟีเจอร์:</p>
                <ul className="list-disc list-inside">
                    {features.map((f, i) => (
                        <li key={i}>{f}</li>
                    ))}
                </ul>
            </div>

            <h2 className="text-2xl font-semibold">
                {price} <span className="text-base text-neutral-500 font-medium">{per}</span>
            </h2>

            {isCurrent ? <Button variant="outline">ตอนนี้คุณอยู่ในแผนนี้</Button> : action}
        </Card>
    );
}

function AboutSection({ aboutMe, interests, profile }) {
    return (
        <>
            {/* card aboutme */}
            <Card className="p-6 flex flex-col gap-4">
                <h2 className="text-2xl">เกี่ยวกับฉัน</h2>
                <p className="text-base">{aboutMe}</p>

                <Separator />

                <h2 className="text-2xl">ความสนใจ</h2>
                <ul className="list-disc list-inside">
                    {interests.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </Card>

            {/* card detail */}
            <Card className="p-6 gap-3">
                {profile.map((field, idx) => (
                    <div key={idx}>
                        <h4>{field.label}</h4>
                        {Array.isArray(field.value) ? (
                            field.value.map((v, i) => (
                                <p key={i} className="text-sm text-neutral-500">
                                    {v}
                                </p>
                            ))
                        ) : (
                            <p className="text-sm text-neutral-500">{field.value}</p>
                        )}
                    </div>
                ))}
            </Card>
        </>
    );
}

const aboutMeText =
    "สวัสดีค่ะ ฉันชอบการท่องเที่ยว ถ่ายภาพ และอ่านหนังสือแนวจิตวิทยา กำลังเรียนรู้การพัฒนาเว็บด้วย Next.js และ TailwindCSS สนใจเรื่องพลังงานและโหราศาสตร์";

const interestsData = ["เทคโนโลยี & การเขียนโค้ด", "จักรวาล & ดวงดาว", "การเดินทาง & ไลฟ์สไตล์", "หนังสือจิตวิทยา"];

const profileData = [
    { label: "ชื่อ-นามสกุล", value: "สุภัสสรา มีแก้ว" },
    { label: "เบอร์โทรศัพท์", value: "089-123-4567" },
    { label: "อีเมล", value: "supassara.m@example.com" },
    {
        label: "โซเชียลมีเดีย",
        value: ["Facebook: facebook.com/namth", "Instagram: @namth_earthtone", "Twitter/X: @namth_dev"],
    },
];

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
                <AboutSection aboutMe={aboutMeText} interests={interestsData} profile={profileData} />
            </div>

            {/* Billing & Subscription */}
            <div className="flex flex-col w-full max-w-5xl gap-12">
                <h1 className="text-2xl font-semibold">Billing & Subscription</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
                    <SubscriptionCard
                        title="Free Plan"
                        features={["ใช้งานพื้นฐานได้ไม่จำกัด", "เข้าถึงเนื้อหาทั่วไป", "จำกัดการดาวน์โหลด 5 ครั้ง/วัน"]}
                        price="0 บาท"
                        isCurrent
                    />
                    <SubscriptionCard
                        title="Basic Plan"
                        features={[
                            "ใช้งานได้ทุกฟังก์ชัน",
                            "จัดเก็บข้อมูลสูงสุด 10GB",
                            "รองรับการเชื่อมต่ออุปกรณ์ 2 เครื่อง",
                        ]}
                        price="199 บาท"
                        action={<DialogSubscription />}
                    />
                    <SubscriptionCard
                        title="Pro Plan"
                        features={[
                            "จัดเก็บข้อมูลสูงสุด 100GB",
                            "รองรับการเชื่อมต่ออุปกรณ์ 5 เครื่อง",
                            "Priority Support ตลอด 24 ชม.",
                            "ฟีเจอร์พิเศษด้านการวิเคราะห์",
                        ]}
                        price="499 บาท"
                        action={<DialogSubscription />}
                    />
                </div>
            </div>
        </div>
    );
}
