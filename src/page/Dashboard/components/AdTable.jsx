// AdTable.jsx
"use client";

import * as React from "react";
import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

/**
 * AdTable component
 * ใช้แสดงตารางรายการโฆษณา
 * @param {Array} data - array ของ object แต่ละแถว
 * @param {Function} onDelete - callback เมื่อกดลบ
 */
export function AdTable({ data = [], onDelete }) {
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
                {data.length > 0 ? (
                    data.map((row, idx) => (
                        <TableRow key={row.id || idx}>
                            <TableCell className="font-medium">{row.place}</TableCell>
                            <TableCell>{row.adStatus}</TableCell>
                            <TableCell>{row.dateRange}</TableCell>
                            <TableCell>{row.budget}</TableCell>
                            <TableCell className="flex justify-end">
                                <Button variant="ghost" size="icon" className="size-8" onClick={() => onDelete?.(row)}>
                                    <Trash2 />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-neutral-500">
                            ไม่พบข้อมูล
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

// ตรวจสอบชนิด props
AdTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            place: PropTypes.string.isRequired,
            adStatus: PropTypes.string.isRequired,
            dateRange: PropTypes.string.isRequired,
            budget: PropTypes.string.isRequired,
        })
    ),
    onDelete: PropTypes.func,
};
