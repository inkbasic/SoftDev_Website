"use client";

// chart
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
    { date: "2024-04-01", desktop: 222, mobile: 150 },
    { date: "2024-04-02", desktop: 97, mobile: 180 },
    { date: "2024-04-03", desktop: 167, mobile: 120 },
    { date: "2024-04-04", desktop: 242, mobile: 260 },
    { date: "2024-04-05", desktop: 373, mobile: 290 },
    { date: "2024-04-06", desktop: 301, mobile: 340 },
    { date: "2024-04-07", desktop: 245, mobile: 180 },
    { date: "2024-04-08", desktop: 409, mobile: 320 },
    { date: "2024-04-09", desktop: 59, mobile: 110 },
    { date: "2024-04-10", desktop: 261, mobile: 190 },
    { date: "2024-04-11", desktop: 327, mobile: 350 },
    { date: "2024-04-12", desktop: 292, mobile: 210 },
    { date: "2024-04-13", desktop: 342, mobile: 380 },
    { date: "2024-04-14", desktop: 137, mobile: 220 },
    { date: "2024-04-15", desktop: 120, mobile: 170 },
    { date: "2024-04-16", desktop: 138, mobile: 190 },
    { date: "2024-04-17", desktop: 446, mobile: 360 },
    { date: "2024-04-18", desktop: 364, mobile: 410 },
    { date: "2024-04-19", desktop: 243, mobile: 180 },
    { date: "2024-04-20", desktop: 89, mobile: 150 },
    { date: "2024-04-21", desktop: 137, mobile: 200 },
    { date: "2024-04-22", desktop: 224, mobile: 170 },
    { date: "2024-04-23", desktop: 138, mobile: 230 },
    { date: "2024-04-24", desktop: 387, mobile: 290 },
    { date: "2024-04-25", desktop: 215, mobile: 250 },
    { date: "2024-04-26", desktop: 75, mobile: 130 },
    { date: "2024-04-27", desktop: 383, mobile: 420 },
    { date: "2024-04-28", desktop: 122, mobile: 180 },
    { date: "2024-04-29", desktop: 315, mobile: 240 },
    { date: "2024-04-30", desktop: 454, mobile: 380 },
    { date: "2024-05-01", desktop: 165, mobile: 220 },
    { date: "2024-05-02", desktop: 293, mobile: 310 },
    { date: "2024-05-03", desktop: 247, mobile: 190 },
    { date: "2024-05-04", desktop: 385, mobile: 420 },
    { date: "2024-05-05", desktop: 481, mobile: 390 },
    { date: "2024-05-06", desktop: 498, mobile: 520 },
    { date: "2024-05-07", desktop: 388, mobile: 300 },
    { date: "2024-05-08", desktop: 149, mobile: 210 },
    { date: "2024-05-09", desktop: 227, mobile: 180 },
    { date: "2024-05-10", desktop: 293, mobile: 330 },
    { date: "2024-05-11", desktop: 335, mobile: 270 },
    { date: "2024-05-12", desktop: 197, mobile: 240 },
    { date: "2024-05-13", desktop: 197, mobile: 160 },
    { date: "2024-05-14", desktop: 448, mobile: 490 },
    { date: "2024-05-15", desktop: 473, mobile: 380 },
    { date: "2024-05-16", desktop: 338, mobile: 400 },
    { date: "2024-05-17", desktop: 499, mobile: 420 },
    { date: "2024-05-18", desktop: 315, mobile: 350 },
    { date: "2024-05-19", desktop: 235, mobile: 180 },
    { date: "2024-05-20", desktop: 177, mobile: 230 },
    { date: "2024-05-21", desktop: 82, mobile: 140 },
    { date: "2024-05-22", desktop: 81, mobile: 120 },
    { date: "2024-05-23", desktop: 252, mobile: 290 },
    { date: "2024-05-24", desktop: 294, mobile: 220 },
    { date: "2024-05-25", desktop: 201, mobile: 250 },
    { date: "2024-05-26", desktop: 213, mobile: 170 },
    { date: "2024-05-27", desktop: 420, mobile: 460 },
    { date: "2024-05-28", desktop: 233, mobile: 190 },
    { date: "2024-05-29", desktop: 78, mobile: 130 },
    { date: "2024-05-30", desktop: 340, mobile: 280 },
    { date: "2024-05-31", desktop: 178, mobile: 230 },
    { date: "2024-06-01", desktop: 178, mobile: 200 },
    { date: "2024-06-02", desktop: 470, mobile: 410 },
    { date: "2024-06-03", desktop: 103, mobile: 160 },
    { date: "2024-06-04", desktop: 439, mobile: 380 },
    { date: "2024-06-05", desktop: 88, mobile: 140 },
    { date: "2024-06-06", desktop: 294, mobile: 250 },
    { date: "2024-06-07", desktop: 323, mobile: 370 },
    { date: "2024-06-08", desktop: 385, mobile: 320 },
    { date: "2024-06-09", desktop: 438, mobile: 480 },
    { date: "2024-06-10", desktop: 155, mobile: 200 },
    { date: "2024-06-11", desktop: 92, mobile: 150 },
    { date: "2024-06-12", desktop: 492, mobile: 420 },
    { date: "2024-06-13", desktop: 81, mobile: 130 },
    { date: "2024-06-14", desktop: 426, mobile: 380 },
    { date: "2024-06-15", desktop: 307, mobile: 350 },
    { date: "2024-06-16", desktop: 371, mobile: 310 },
    { date: "2024-06-17", desktop: 475, mobile: 520 },
    { date: "2024-06-18", desktop: 107, mobile: 170 },
    { date: "2024-06-19", desktop: 341, mobile: 290 },
    { date: "2024-06-20", desktop: 408, mobile: 450 },
    { date: "2024-06-21", desktop: 169, mobile: 210 },
    { date: "2024-06-22", desktop: 317, mobile: 270 },
    { date: "2024-06-23", desktop: 480, mobile: 530 },
    { date: "2024-06-24", desktop: 132, mobile: 180 },
    { date: "2024-06-25", desktop: 141, mobile: 190 },
    { date: "2024-06-26", desktop: 434, mobile: 380 },
    { date: "2024-06-27", desktop: 448, mobile: 490 },
    { date: "2024-06-28", desktop: 149, mobile: 200 },
    { date: "2024-06-29", desktop: 103, mobile: 160 },
    { date: "2024-06-30", desktop: 446, mobile: 400 },
];

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
};

export function ChartAreaInteractive({ title, description }) {
    const [timeRange, setTimeRange] = React.useState("90d");

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date("2024-06-30");
        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            3 เดือนที่ผ่านมา
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            30 วันที่ผ่านมา
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            7 วันที่ผ่านมา
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="mobile"
                            type="natural"
                            fill="url(#fillMobile)"
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

// table
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const tableData = [
    {
        place: "วัดพระธาตุดอยสุเทพ",
        adStatus: "✅ กำลังทำงาน",
        dateRange: "15 ส.ค. 2025 - 15 ก.ย. 2025",
        budget: "฿12,000",
    },
    {
        place: "หาดป่าตอง ภูเก็ต",
        adStatus: "⏳ รอตรวจสอบ",
        dateRange: "10 ก.ย. 2025 - 10 ต.ค. 2025",
        budget: "฿18,500",
    },
    {
        place: "ตลาดนัดจตุจักร",
        adStatus: "❌ หมดอายุ",
        dateRange: "01 ก.ค. 2025 - 31 ก.ค. 2025",
        budget: "฿8,000",
    },
];

export function TableDemo() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[300px]">สถานะโฆษณา</TableHead>
                    <TableHead>สถานะโฆษณา</TableHead>
                    <TableHead>วันเริ่มต้น / สิ้นสุด</TableHead>
                    <TableHead>ค่าใช้จ่าย</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">{invoice.place}</TableCell>
                        <TableCell>{invoice.adStatus}</TableCell>
                        <TableCell>{invoice.dateRange}</TableCell>
                        <TableCell>{invoice.budget}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon" className="size-8">
                                <Trash2 />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

// Pagination
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationDemo() {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

// main
import { Plus, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function StatCard({ title, value, change, trend, description, isUp = true }) {
    return (
        <Card className="w-full p-6 gap-2">
            <div className="flex justify-between">
                <p className="text-sm text-neutral-500">{title}</p>
                <Badge variant="outline">
                    {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {change}
                </Badge>
            </div>
            <h2 className="text-2xl">{value}</h2>
            <div className="flex flex-col pt-4 gap-1">
                <p className="text-sm text-black">{trend}</p>
                <p className="text-sm text-neutral-500">{description}</p>
            </div>
        </Card>
    );
}

const chartTabs = [
    {
        value: "view",
        label: "ยอดเข้าชมโฆษณา",
        title: "ยอดเข้าชมโฆษณา",
        description: "จำนวนครั้งที่โฆษณาของคุณถูกแสดงให้ผู้ใช้เห็นในช่วงเวลาที่กำหนด",
    },
    {
        value: "click",
        label: "จำนวนคลิก",
        title: "จำนวนคลิก",
        description: "จำนวนครั้งที่ผู้ใช้คลิกที่โฆษณาของคุณเพื่อดูรายละเอียดเพิ่มเติม",
    },
    {
        value: "ctr",
        label: "อัตรา CTR",
        title: "อัตรา CTR",
        description: "เปอร์เซ็นต์การคลิกเมื่อเทียบกับยอดเข้าชมทั้งหมด ยิ่งสูงแสดงว่าโฆษณาดึงดูดมากขึ้น",
    },
    {
        value: "contact",
        label: "การติดต่อ",
        title: "การติดต่อ",
        description: "จำนวนครั้งที่ผู้ใช้ติดต่อคุณผ่านโฆษณา เช่น โทร อีเมล หรือข้อความ",
    },
    {
        value: "booking",
        label: "ยอดจองผ่านโฆษณา",
        title: "ยอดจองผ่านโฆษณา",
        description: "จำนวนการจองที่เกิดจากผู้ใช้ที่เข้ามาจากโฆษณาโดยตรง",
    },
];

export default function Dashboard() {
    return (
        <div className="w-screen py-20 px-4 flex flex-col gap-6 justify-center items-center">
            {/* header */}
            <div className="flex justify-between items-center w-full max-w-5xl">
                <h2 className="text-2xl font-semibold">Dashboard</h2>
                <Button>
                    <Plus />
                    เพิ่มสถานที่
                </Button>
            </div>

            {/* stat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
                <StatCard
                    title="ยอดเข้าชมโฆษณา (Views)"
                    value="12,540 ครั้ง"
                    change="+12.5%"
                    trend="แนวโน้มขึ้นในเดือนนี้"
                    description="ผู้เยี่ยมชมในช่วง 6 เดือนที่ผ่านมา"
                    isUp={true}
                />
                <StatCard
                    title="จำนวนการคลิก (Clicks)"
                    value="4,320 คลิก"
                    change="-5.2%"
                    trend="แนวโน้มลดลงในเดือนนี้"
                    description="อัตราการคลิกในช่วง 6 เดือนที่ผ่านมา"
                    isUp={false}
                />
                <StatCard
                    title="การติดต่อ (Contacts)"
                    value="1,250 ครั้ง"
                    change="+8.7%"
                    trend="แนวโน้มเพิ่มขึ้นในเดือนนี้"
                    description="จำนวนการติดต่อผ่านโฆษณาในช่วง 6 เดือนที่ผ่านมา"
                    isUp={true}
                />
                <StatCard
                    title="ยอดจองผ่านโฆษณา (Bookings)"
                    value="320 การจอง"
                    change="+15.3%"
                    trend="แนวโน้มเพิ่มขึ้นต่อเนื่อง"
                    description="จำนวนการจองที่เกิดจากการกดผ่านโฆษณาในช่วง 6 เดือนที่ผ่านมา"
                    isUp={true}
                />
            </div>

            {/* tab */}
            <div className="flex w-full max-w-5xl flex-col gap-6 pt-20">
                <Tabs defaultValue="view" className="gap-6">
                    <Select>
                        <SelectTrigger className="w-[180px] sm:hidden">
                            <SelectValue placeholder="เลือกหัวข้อ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {chartTabs.map((tab) => (
                                    <SelectItem key={tab.value} value={tab.value}>
                                        {tab.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <TabsList className="hidden sm:block">
                        {chartTabs.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {chartTabs.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            <ChartAreaInteractive title={tab.title} description={tab.description} />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* table */}
            <div className="flex flex-col w-full max-w-5xl pt-20 gap-6">
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="outline">
                        <Plus />
                        เพิ่มสถานที่
                    </Button>
                    <Button variant="outline">
                        <Plus />
                        ลงโฆษณา
                    </Button>
                </div>
                <TableDemo />
                <PaginationDemo />
            </div>
        </div>
    );
}
