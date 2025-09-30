// PlaceTable.jsx
"use client";

import * as React from "react";
import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

/**
 * PlaceTable component
 * ใช้แสดงตารางรายการสถานที่ (place) พร้อมการจัดการ
 * @param {Array} data - array ของ place objects
 * @param {Function} onAddAd - callback เมื่อกดเพิ่มโฆษณาให้สถานที่นั้นๆ
 * @param {Function} onDelete - callback เมื่อกดลบสถานที่นั้นๆ
 */
export function PlaceTable({ data = [], onAddAd, onDelete }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[320px]">ชื่อสถานที่</TableHead>
                    <TableHead>แท็ก</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead className="w-[220px] text-right">ฟังก์ชัน</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.length > 0 ? (
                    data.map((row, idx) => {
                        const key = row._id ?? row.id ?? idx;
                        const tags = Array.isArray(row.tags) ? row.tags : [];
                        return (
                            <TableRow key={key}>
                                <TableCell className="font-medium">{row.name || "-"}</TableCell>

                                <TableCell className="align-top">
                                    {tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {tags.map((t, i) => (
                                                <Badge key={i} variant="secondary" className="rounded-full">
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-neutral-500">—</span>
                                    )}
                                </TableCell>

                                <TableCell>{row.type || "-"}</TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => onAddAd?.(row)}
                                            title="เพิ่มโฆษณาให้สถานที่นี้"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            เพิ่มโฆษณา
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() => onDelete?.(row)}
                                            title="ลบรายการนี้"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-neutral-500">
                            ไม่พบข้อมูล
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

// ตรวจสอบชนิด props
PlaceTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string.isRequired,
            tags: PropTypes.arrayOf(PropTypes.string),
            type: PropTypes.string, // เช่น "Restaurant", "Accommodation", ...
        })
    ),
    onAddAd: PropTypes.func, // (place) => void
    onDelete: PropTypes.func, // (place) => void
};
