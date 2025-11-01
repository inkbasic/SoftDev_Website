import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings, Ellipsis } from "lucide-react";
import DialogPayment from "@/components/DialogPayment";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:3000";

// Create initials for Avatar
function toInitials(firstName = "", lastName = "", userName = "") {
    const name = `${firstName || ""} ${lastName || ""}`.trim() || userName || "";
    if (!name) return "U";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Subscription card component
function SubscriptionCard({ title, features, price, per = "/เดือน", isCurrent = false, action }) {
    return (
        <Card className="flex flex-col justify-between gap-4 p-6">
            <h2 className="text-2xl font-semibold">{title}</h2>

            <div>
                <p>ฟีเจอร์:</p>
                <ul className="list-disc list-inside">
                    {features.map((f, i) => (
                        <li className="!p-0" key={i}>
                            {f}
                        </li>
                    ))}
                </ul>
            </div>

            <h2 className="text-2xl font-semibold">
                {price} <span className="text-base font-medium text-neutral-500">{per}</span>
            </h2>

            {isCurrent ? <Button variant="outline">ตอนนี้คุณอยู่ในแผนนี้</Button> : action}
        </Card>
    );
}

// About section component
function AboutSection({ aboutMe, interests, profile }) {
    return (
        <>
            {/* card aboutme */}
            <Card className="flex flex-col gap-4 p-6">
                <h2 className="text-2xl">เกี่ยวกับฉัน</h2>
                <p className="text-base">{aboutMe}</p>

                <Separator />

                <h2 className="text-2xl">ความสนใจ</h2>
                <ul className="list-disc list-inside">
                    {interests.map((item, idx) => (
                        <li className="!p-0" key={idx}>
                            {item}
                        </li>
                    ))}
                </ul>
            </Card>

            {/* card detail */}
            <Card className="gap-3 p-6">
                {profile.map((field, idx) => (
                    <div key={idx} className="space-y-1">
                        <h5 className="font-medium">{field.label}</h5>
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

const aboutMeDefault =
    "สวัสดีค่ะ ฉันชอบการท่องเที่ยว ถ่ายภาพ และอ่านหนังสือแนวจิตวิทยา กำลังเรียนรู้การพัฒนาเว็บด้วย Next.js และ TailwindCSS สนใจเรื่องพลังงานและโหราศาสตร์";

const interestsDefault = ["เทคโนโลยี & การเขียนโค้ด", "จักรวาล & ดวงดาว", "การเดินทาง & ไลฟ์สไตล์", "หนังสือจิตวิทยา"];

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch user data from API
    useEffect(() => {
        const token = Cookies.get("jwtToken");
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        async function fetchUserProfile() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/users`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        "Cache-Control": "no-cache"
                    },
                    cache: "no-store"
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        Cookies.remove("jwtToken");
                        navigate("/login", { replace: true });
                        throw new Error("โทเค็นหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
                    }
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.message || `${res.status} ${res.statusText}`);
                }

                const userData = await res.json();
                setUser(userData);

            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch user data:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchUserProfile();
    }, [navigate]);

    // Prepare header info
    const headerInfo = useMemo(() => {
        // Default header info when no user; which should not happen due to redirect
        if (!user) {
            return {
                title: "ชื่อผู้ใช้",
                subtitle: "ไบโอของผู้ใช้",
                avatarUrl: "https://github.com/shadcn.png",
                fallback: "U",
            };
        }

        const title =
            user.firstName || user.lastName
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                : user.userName || "ผู้ใช้";
        const subtitle = user.email || user.role || "user";
        const avatarUrl = user.profileImage && typeof user.profileImage === "string" ? user.profileImage : "https://ui-avatars.com/api/?background=random&name=" + 
        (`${user.firstName} ${user.lastName}` || "User");
        const fallback = toInitials(user.firstName, user.lastName, user.userName);

        return { title, subtitle, avatarUrl, fallback };
    }, [user]);

    // Prepare profile data
    const profileData = useMemo(() => {
        if (!user) {
            return [
                { label: "ชื่อ-นามสกุล", value: "-" },
                { label: "ชื่อผู้ใช้", value: "-" },
                { label: "อีเมล", value: "-" },
                { label: "เบอร์โทรศัพท์", value: "-" },
                { label: "บทบาท", value: "-" },
                {
                    label: "โซเชียลมีเดีย",
                    value: ["Facebook: -", "Instagram: -", "Twitter/X: -"],
                },
            ];
        }
        return [
            {
                label: "ชื่อ-นามสกุล",
                value: user.firstName || user.lastName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "-",
            },
            { label: "ชื่อผู้ใช้", value: user.userName || "-" },
            { label: "อีเมล", value: user.email || "-" },
            { label: "เบอร์โทรศัพท์", value: user.phoneNumber || "-" },
            { label: "บทบาท", value: user.role || "-" },
            {
                label: "โซเชียลมีเดีย",
                value: ["Facebook: -", "Instagram: -", "Twitter/X: -"],
            },
        ];
    }, [user]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-8 px-6 py-20">
                <Card className="w-full max-w-5xl p-6 text-center">
                    <p className="text-neutral-600">กำลังโหลดข้อมูลผู้ใช้...</p>
                </Card>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-8 px-6 py-20">
                <Card className="w-full max-w-5xl p-6 text-center">
                    <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
                    <Button 
                        onClick={() => navigate("/login")} 
                        className="mt-4 bg-gradient-to-l from-[#FF7474] to-[#FF9F43]"
                    >
                        กลับไปหน้าเข้าสู่ระบบ
                    </Button>
                </Card>
            </div>
        );
    }

    // Case: no user yet
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center gap-8 px-6 py-20">
                <header className="flex items-center justify-between w-full max-w-5xl">
                    <div className="flex gap-4 sm:flex-row lg:gap-7">
                        <Avatar className="size-[50px] lg:size-[150px]">
                            <AvatarImage src={headerInfo.avatarUrl} />
                            <AvatarFallback>{headerInfo.fallback}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-center lg:gap-2">
                            <h5 className="text-sm font-semibold lg:text-2xl">{headerInfo.title}</h5>
                            <p className="text-sm lg:text-base text-neutral-500">{headerInfo.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-4">
                        <Button variant="outline" size="icon" className="size-9 lg:hidden hover:cursor-pointer">
                            <Ellipsis />
                        </Button>
                        <Button variant="outline" size="icon" className="hidden size-9 lg:flex hover:cursor-pointer">
                            <Settings />
                        </Button>
                        <Button variant="outline" className="hidden px-6 lg:flex hover:cursor-pointer" disabled>
                            แก้ไข
                        </Button>
                    </div>
                </header>

                <Card className="w-full max-w-5xl p-6 text-center">
                    <p className="text-neutral-600">
                        ไม่พบข้อมูลผู้ใช้ โปรดเข้าสู่ระบบก่อน
                    </p>
                    <Button 
                        onClick={() => navigate("/login")} 
                        className="mt-4 bg-gradient-to-l from-[#FF7474] to-[#FF9F43]"
                    >
                        เข้าสู่ระบบ
                    </Button>
                </Card>
            </div>
        );
    }

    // Full profile view with data from API
    return (
        <div className="flex flex-col items-center justify-center gap-12 px-6 py-20">
            <header className="flex items-center justify-between w-full max-w-5xl">
                <div className="flex gap-4 sm:flex-row lg:gap-7">
                    <Avatar className="size-[50px] lg:size-[150px]">
                        <AvatarImage src={headerInfo.avatarUrl} />
                        <AvatarFallback>{headerInfo.fallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center lg:gap-2">
                        <h5 className="text-sm font-semibold lg:text-2xl">{headerInfo.title}</h5>
                        <p className="text-sm lg:text-base text-neutral-500">{headerInfo.subtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 lg:gap-4">
                    <Button variant="outline" size="icon" className="size-9 lg:hidden hover:cursor-pointer">
                        <Ellipsis />
                    </Button>
                    {/* <Button variant="outline" size="icon" className="hidden size-9 lg:flex hover:cursor-pointer">
                        <Settings />
                    </Button>
                    <Button 
                        variant="outline" 
                        className="hidden px-6 lg:flex hover:cursor-pointer"
                        onClick={() => navigate("/profile/edit")}
                    >
                        แก้ไข
                    </Button> */}
                </div>
            </header>

            {/* user detail */}
            <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
                <AboutSection aboutMe={aboutMeDefault} interests={interestsDefault} profile={profileData} />
            </div>

            {/* Billing & Subscription */}
            {/* <div className="flex flex-col w-full max-w-5xl gap-12">
                <h5 className="text-2xl font-semibold">Billing & Subscription</h5>
                <div className="grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
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
                        action={
                            <Button className="w-full bg-gradient-to-l from-[#FF7474] to-[#FF9F43] hover:cursor-pointer">ชำระเงิน</Button>
                        }
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
                        action={
                            <Button className="w-full bg-gradient-to-l from-[#FF7474] to-[#FF9F43] hover:cursor-pointer">ชำระเงิน</Button>
                        }
                    />
                </div>
            </div> */}
        </div>
    );
}