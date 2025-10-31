// StatCard.jsx
"use client";

import * as React from "react";
import PropTypes from "prop-types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * StatCard
 * component สำหรับแสดงการ์ดสถิติ
 * @param {string} title - ชื่อหัวข้อ
 * @param {string|number} value - ค่าตัวเลขหลัก
 * @param {string} change - ข้อความเปอร์เซ็นต์การเปลี่ยนแปลง
 * @param {string} trend - แนวโน้ม
 * @param {string} description - คำอธิบาย
 * @param {boolean} isUp - ใช้กำหนดไอคอนลูกศร (ขึ้น/ลง)
 */
export function StatCard({ title, value, change, trend, description, isUp = true }) {
    return (
        <Card className="w-full gap-2 p-6">
            <div className="flex justify-between">
                <p className="text-sm text-neutral-500">{title}</p>
                {/* {change && (
                    <Badge variant="outline" className="gap-1">
                        {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {change}
                    </Badge>
                )} */}
            </div>
            <h2 className="text-2xl">{value}</h2>
            {(trend || description) && (
                <div className="flex flex-col gap-1 pt-4">
                    {trend && <p className="text-sm text-black">{trend}</p>}
                    {description && <p className="text-sm text-neutral-500">{description}</p>}
                </div>
            )}
        </Card>
    );
}

// ตรวจสอบชนิด props
StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    change: PropTypes.string,
    trend: PropTypes.string,
    description: PropTypes.string,
    isUp: PropTypes.bool,
};
