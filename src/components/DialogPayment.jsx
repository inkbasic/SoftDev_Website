import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

export default function DialogPayment() {
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
