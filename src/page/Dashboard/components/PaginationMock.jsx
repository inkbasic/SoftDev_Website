// PaginationMock.jsx
"use client";

import * as React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * PaginationMock
 * Component mockup สำหรับแสดง pagination แบบ static
 * ไม่มีการรับ input หรือ state ภายนอก
 */
export function PaginationMock() {
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
