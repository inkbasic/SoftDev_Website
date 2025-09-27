"use client";

// table
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
                    <TableHead className="w-[300px]">สถานที่</TableHead>
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
                <PaginationItem className="!p-0">
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem className="!p-0">
                    <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem className="!p-0">
                    <PaginationLink href="#" isActive>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem className="!p-0">
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem className="!p-0">
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem className="!p-0">
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
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChartAreaInteractive } from "@/components/Chart";
import { chartData } from "@/mockdata/ChartData";
import { generateChartConfig } from "@/components/generateChartConfig";

import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const chartConfig = generateChartConfig(chartData);

function StatCard({ title, value, change, trend, description, isUp = true }) {
    return (
        <Card className="w-full gap-2 p-6">
            <div className="flex justify-between">
                <p className="text-sm text-neutral-500">{title}</p>
                <Badge variant="outline">
                    {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {change}
                </Badge>
            </div>
            <h2 className="text-2xl">{value}</h2>
            <div className="flex flex-col gap-1 pt-4">
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
    const navigate = useNavigate(); // hook สำหรับ redirect

    // ถ้ามี token อยู่แล้ว ให้เด้งไป home
    useEffect(() => {
        const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
        if (!token) navigate("/login", { replace: true });
    }, [navigate]);

    const handleAddLocation = () => {
        navigate("/addlocation");
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6 px-4 py-20">
            {/* header */}
            <div className="flex items-center justify-between w-full max-w-5xl pb-4">
                <h2 className="text-2xl">Dashboard</h2>
                {/* <Button>
                    <Plus />
                    เพิ่มสถานที่
                </Button> */}
            </div>

            {/* stat */}
            <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
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
            <div className="flex flex-col w-full max-w-5xl gap-6 pt-20">
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
                            <ChartAreaInteractive
                                title={tab.title}
                                description={tab.description}
                                chartData={chartData}
                                chartConfig={chartConfig}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* table */}
            <div className="flex flex-col w-full max-w-5xl gap-6 pt-20">
                <div className="flex justify-end w-full gap-3">
                    <Button variant="outline" onClick={handleAddLocation}>
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
