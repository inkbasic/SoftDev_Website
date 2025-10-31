"use client";

import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Cookies from "js-cookie";

/* ===================== Utilities ===================== */

/** แปลง "HH:mm" → "1970-01-01THH:mm:00+07:00" ตามสเปก API */
export function hhmmToApiISO(hhmm) {
    const [h, m] = (hhmm || "").split(":").map((v) => (v ?? "").toString().padStart(2, "0"));
    if (!h || !m) return "";
    return `1970-01-01T${h}:${m}:00+07:00`;
}

/** ดึง JWT จาก local/session storage */
export function getToken() {
    return Cookies.get("jwtToken") || "";
}

export const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
export const isFiniteNum = (v) => Number.isFinite(Number(v));

/* ===================== Reusable Inputs ===================== */

export function InputField({ label, id, placeholder, type = "text", value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={value ?? ""}
                onChange={(e) => onChange(id, e.target.value)}
            />
        </div>
    );
}

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
};

export function TextAreaField({ label, id, placeholder, value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Textarea
                id={id}
                name={id}
                placeholder={placeholder}
                value={value ?? ""}
                onChange={(e) => onChange(id, e.target.value)}
            />
        </div>
    );
}

TextAreaField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export function FormSection({ title, description, children }) {
    return (
        <div className="flex flex-col w-full gap-6">
            <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                {description ? <p className="text-neutral-500">{description}</p> : null}
            </div>
            {children}
        </div>
    );
}

FormSection.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    children: PropTypes.node,
};

export function ReusableSelect({ label, placeholder, options, value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="border-gray-200">
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

ReusableSelect.propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

/* ===================== Default export (optional) ===================== */
/** ช่วยให้ import ได้สองแบบ:
 * 1) import { InputField, hhmmToApiISO } from "@/components/common/FormPieces";
 * 2) import FormPieces from "@/components/common/FormPieces"; FormPieces.InputField ...
 */
const FormPieces = {
    // utilities
    hhmmToApiISO,
    getToken,
    clamp,
    isFiniteNum,
    // components
    InputField,
    TextAreaField,
    FormSection,
    ReusableSelect,
};

export default FormPieces;
