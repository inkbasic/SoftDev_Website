// PlaceTable.jsx
"use client";

import * as React from "react";
import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// dialog
import DialogPayment from "@/components/DialogPayment";
import DeletePlaceDialog from "./DeletePlaceDialog";

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
                    <TableHead className="w-[300px]">สถานที่</TableHead>
                    <TableHead className="max-w-[300px]">แท็ก</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead></TableHead>
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

                                <TableCell className="align-top max-w-[300px]">
                                    {tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {tags.map((t, i) => (
                                                <Badge key={i} variant="secondary" className="bg-gray-100 rounded-full">
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-neutral-500">—</span>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {{
                                        Restaurant: "ร้านอาหาร",
                                        Accommodation: "ที่พัก",
                                        Attraction: "สถานที่ท่องเที่ยว",
                                    }[row.type] || "-"}
                                </TableCell>

                                <TableCell className="flex items-center justify-end gap-4">
                                    <DialogPayment placeId={row._id} />
                                    <DeletePlaceDialog placeId={row._id} />
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
