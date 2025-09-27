// src/components/AddPlaceForm.jsx
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// ถ้าโปรเจกต์ไม่มี Textarea ของ shadcn/ui ให้เปลี่ยนเป็น Input ได้
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ===================== Utilities ===================== */

// แปลง "HH:mm" → "1970-01-01THH:mm:00+07:00" ตามสเปก API
function hhmmToApiISO(hhmm) {
    const [h, m] = (hhmm || "").split(":").map((v) => v.padStart(2, "0"));
    if (!h || !m) return "";
    return `1970-01-01T${h}:${m}:00+07:00`;
}

// ดึง JWT จาก local/session storage
function getToken() {
    const fromLocal = localStorage.getItem("jwtToken");
    if (fromLocal) return fromLocal;
    const fromSession = sessionStorage.getItem("jwtToken");
    return fromSession || "";
}

const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
const isFiniteNum = (v) => Number.isFinite(Number(v));

/* ===================== Reusable Inputs ===================== */

function InputField({ label, id, placeholder, type = "text", value, onChange }) {
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

function TextAreaField({ label, id, placeholder, value, onChange }) {
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

function FormSection({ title, description, children }) {
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

function ReusableSelect({ label, placeholder, options, value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
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

/* ===================== Main Component (JSX) ===================== */
/**
 * รองรับ 3 endpoint ตาม type:
 * - /places/accommodation
 * - /places/attraction
 * - /places/restaurant
 * method: POST
 * headers: { Authorization: "Bearer <jwtToken>" }
 */
export default function AddPlaceForm() {
    // ตั้งค่า base URL ผ่าน .env (เช่น VITE_API_BASE=https://api.example.com)
    const API_BASE = "";

    // type ของข้อมูล
    const [type, setType] = useState("accommodation"); // "accommodation" | "attraction" | "restaurant"

    // สถานะ request/ผลลัพธ์
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    // ฟิลด์ร่วม
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState(""); // comma-separated

    // location: [lng, lat]
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    // accommodation
    const [facilities, setFacilities] = useState("");
    const [starRating, setStarRating] = useState("0");
    const [redirectUrl, setRedirectUrl] = useState("");

    // attraction
    const [entryFee, setEntryFee] = useState("0");

    // restaurant
    const [openingHours, setOpeningHours] = useState("09:00"); // HH:mm
    const [closingHours, setClosingHours] = useState("21:00");
    const [cuisineType, setCuisineType] = useState("");
    const [contactInfo, setContactInfo] = useState("");

    const typeLabelMap = useMemo(
        () => ({
            accommodation: "ที่พัก",
            attraction: "สถานที่ท่องเที่ยว",
            restaurant: "ร้านอาหาร",
        }),
        []
    );

    // เคลียร์ผลลัพธ์เมื่อเปลี่ยน type
    useEffect(() => {
        setResponseData(null);
        setErrorMsg("");
    }, [type]);

    // สร้าง payload ตาม type
    function buildBody() {
        const lon = Number(lng);
        const latNum = Number(lat);

        const tagsArr = (tags || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const facilitiesArr = (facilities || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        if (type === "accommodation") {
            return {
                name: name.trim(),
                imageUrl: imageUrl.trim(),
                location: [lon, latNum], // [lng, lat]
                description: description.trim(),
                tags: tagsArr,
                facilities: facilitiesArr,
                starRating: Number(starRating),
                redirectUrl: redirectUrl.trim(),
            };
        }

        if (type === "attraction") {
            return {
                name: name.trim(),
                imageUrl: imageUrl.trim(),
                location: [lon, latNum],
                description: description.trim(),
                tags: tagsArr,
                entryFee: Number(entryFee),
            };
        }

        // restaurant
        return {
            name: name.trim(),
            imageUrl: imageUrl.trim(),
            location: [lon, latNum],
            description: description.trim(),
            tags: tagsArr,
            openingHours: hhmmToApiISO(openingHours),
            closingHours: hhmmToApiISO(closingHours),
            cuisineType: cuisineType.trim(),
            contactInfo: contactInfo.trim(),
        };
    }

    // ตรวจค่าก่อนยิง API
    function validate(body) {
        if (!body.name) return "กรุณากรอกชื่อ";
        if (!body.imageUrl) return "กรุณากรอกลิงก์รูปภาพ (imageUrl)";
        if (!Array.isArray(body.location) || body.location.length !== 2) return "กรุณากรอก location เป็น [lng, lat]";

        const [lon, latNum] = body.location;
        if (!isFiniteNum(lon) || !isFiniteNum(latNum)) {
            return "longitude/latitude ต้องเป็นตัวเลข";
        }
        if (lon < -180 || lon > 180) return "longitude ต้องอยู่ในช่วง −180 ถึง 180";
        if (latNum < -90 || latNum > 90) return "latitude ต้องอยู่ในช่วง −90 ถึง 90";
        if (!body.description) return "กรุณากรอกคำอธิบาย";

        if (type === "accommodation") {
            if (!isFiniteNum(body.starRating)) return "ดาว ต้องเป็นตัวเลข";
            if (body.starRating < 0 || body.starRating > 5) return "ดาว ต้องอยู่ระหว่าง 0–5";
        }

        if (type === "attraction") {
            if (!isFiniteNum(body.entryFee)) return "ค่าเข้าชม ต้องเป็นตัวเลข";
            if (body.entryFee < 0) return "ค่าเข้าชม ต้องมากกว่าหรือเท่ากับ 0";
        }

        if (type === "restaurant") {
            if (!body.openingHours || !body.closingHours) return "กรุณากรอกเวลาเปิด/ปิด";
            // ตรวจรูปแบบ HH:mm แบบคร่าว ๆ
            const asISO = (s) => hhmmToApiISO(s);
            const ok = (iso) =>
                typeof iso === "string" && iso.startsWith("1970-01-01T") && /^\d{2}:\d{2}/.test(iso.slice(11));
            if (!ok(asISO(openingHours)) || !ok(asISO(closingHours))) {
                return "รูปแบบเวลาไม่ถูกต้อง (เช่น 09:00)";
            }
        }

        return null;
    }

    // เรียก API
    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg("");
        setResponseData(null);

        const body = buildBody();
        const err = validate(body);
        if (err) {
            toast.error(err);
            setErrorMsg(err);
            return;
        }

        const endpoint =
            type === "accommodation"
                ? "/places/accommodation"
                : type === "attraction"
                ? "/places/attraction"
                : "/places/restaurant";

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken() || "jwtToken"}`, // fallback เผื่อทดสอบ
                },
                body: JSON.stringify(body),
            });

            const data = await res.json().catch(() => ({
                message: "ไม่สามารถอ่านข้อมูลตอบกลับได้",
            }));

            if (!res.ok) {
                // โครงสร้าง error ที่ให้มา:
                // {
                //   "message": ["Give me longitude and latitude", "..."],
                //   "error": "Bad Request",
                //   "statusCode": 400
                // }
                let msg = "เกิดข้อผิดพลาด";
                if (data && data.message) {
                    msg = Array.isArray(data.message) ? data.message.join(" • ") : String(data.message);
                } else if (data && data.error) {
                    msg = `${data.error}${data.statusCode ? ` (${data.statusCode})` : ""}`;
                }
                setErrorMsg(msg);
                toast.error(msg);
                return;
            }

            setResponseData(data);
            toast.success("บันทึกข้อมูลสำเร็จ 🎉");
        } catch (error) {
            const msg = error?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
            setErrorMsg(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    // Preview payload (memo เพื่อไม่คำนวณซ้ำโดยไม่จำเป็น)
    const previewPayload = useMemo(
        () => buildBody(),
        [
            name,
            imageUrl,
            description,
            tags,
            lat,
            lng,
            facilities,
            starRating,
            redirectUrl,
            entryFee,
            openingHours,
            closingHours,
            cuisineType,
            contactInfo,
            type,
        ]
    );

    // ฟิลด์เฉพาะตามประเภท
    function renderTypeSpecificFields() {
        if (type === "accommodation") {
            return (
                <>
                    <InputField
                        label="สิ่งอำนวยความสะดวก (คั่นด้วย ,)"
                        id="facilities"
                        placeholder="Pool, Gym, Wifi"
                        value={facilities}
                        onChange={(_, v) => setFacilities(v)}
                    />
                    <InputField
                        label="ดาว (0–5)"
                        id="starRating"
                        type="number"
                        placeholder="5"
                        value={starRating}
                        onChange={(_, v) => {
                            const n = clamp(Number(v), 0, 5);
                            setStarRating(String(Number.isNaN(n) ? 0 : n));
                        }}
                    />
                    <InputField
                        label="ลิงก์ Redirect"
                        id="redirectUrl"
                        placeholder="https://booking.example.com"
                        value={redirectUrl}
                        onChange={(_, v) => setRedirectUrl(v)}
                    />
                </>
            );
        }

        if (type === "attraction") {
            return (
                <>
                    <InputField
                        label="ค่าเข้าชม (ตัวเลข)"
                        id="entryFee"
                        type="number"
                        placeholder="200"
                        value={entryFee}
                        onChange={(_, v) => {
                            const n = Math.max(0, Number(v));
                            setEntryFee(String(Number.isNaN(n) ? 0 : n));
                        }}
                    />
                </>
            );
        }

        // restaurant
        return (
            <>
                <InputField
                    label="เวลาเปิด (HH:mm)"
                    id="openingHours"
                    placeholder="09:00"
                    value={openingHours}
                    onChange={(_, v) => setOpeningHours(v)}
                />
                <InputField
                    label="เวลาปิด (HH:mm)"
                    id="closingHours"
                    placeholder="21:00"
                    value={closingHours}
                    onChange={(_, v) => setClosingHours(v)}
                />
                <InputField
                    label="ประเภทอาหาร"
                    id="cuisineType"
                    placeholder="Thai, Noodles"
                    value={cuisineType}
                    onChange={(_, v) => setCuisineType(v)}
                />
                <InputField
                    label="ข้อมูลติดต่อ"
                    id="contactInfo"
                    placeholder="091-234-5678"
                    value={contactInfo}
                    onChange={(_, v) => setContactInfo(v)}
                />
            </>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full gap-12 px-6 py-12 sm:px-12">
            <h5 className="w-full max-w-5xl text-2xl font-semibold">เพิ่มข้อมูลสถานที่</h5>

            {/* เลือกประเภทข้อมูล */}
            <div className="w-full max-w-5xl">
                <ReusableSelect
                    label="เลือกประเภทข้อมูล"
                    placeholder="ที่พัก / สถานที่ท่องเที่ยว / ร้านอาหาร"
                    options={[
                        { value: "accommodation", label: "ที่พัก" },
                        { value: "attraction", label: "สถานที่ท่องเที่ยว" },
                        { value: "restaurant", label: "ร้านอาหาร" },
                    ]}
                    value={type}
                    onChange={(v) => setType(v)}
                />
            </div>

            {/* ฟอร์ม */}
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-5xl gap-12">
                <FormSection
                    title={`กรอกข้อมูลสำหรับ “${typeLabelMap[type]}”`}
                    description="* จำเป็นต้องกรอก name, imageUrl, location (lng/lat), description"
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Common fields */}
                        <InputField
                            label="ชื่อ"
                            id="name"
                            placeholder="Ocean View Resort / Emerald Pool / Jinda Noodle"
                            value={name}
                            onChange={(_, v) => setName(v)}
                        />
                        <InputField
                            label="ลิงก์รูปภาพ (imageUrl)"
                            id="imageUrl"
                            placeholder="https://example.com/photo.jpg"
                            value={imageUrl}
                            onChange={(_, v) => setImageUrl(v)}
                        />
                        {/* Location */}
                        <InputField
                            label="Longitude (−180 ถึง 180)"
                            id="longitude"
                            type="number"
                            placeholder="100.5018"
                            value={lng}
                            onChange={(_, v) => setLng(v)}
                        />
                        <InputField
                            label="Latitude (−90 ถึง 90)"
                            id="latitude"
                            type="number"
                            placeholder="13.7563"
                            value={lat}
                            onChange={(_, v) => setLat(v)}
                        />
                        {/* Description & Tags */}
                        <TextAreaField
                            label="คำอธิบาย"
                            id="description"
                            placeholder="บรรยายสถานที่โดยย่อ..."
                            value={description}
                            onChange={(_, v) => setDescription(v)}
                        />
                        <InputField
                            label="แท็ก (คั่นด้วย ,)"
                            id="tags"
                            placeholder="beach, family, halal"
                            value={tags}
                            onChange={(_, v) => setTags(v)}
                        />

                        {/* Type-specific */}
                        {renderTypeSpecificFields()}
                    </div>
                </FormSection>

                {/* Preview Payload */}
                <FormSection title="ตัวอย่างข้อมูลที่จะส่ง (Preview)" description="ตรวจสอบก่อนกดบันทึก">
                    <pre className="max-h-[320px] overflow-auto rounded-lg bg-neutral-900 p-4 text-sm text-neutral-100">
                        {JSON.stringify(previewPayload, null, 2)}
                    </pre>
                </FormSection>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setName("");
                            setImageUrl("");
                            setDescription("");
                            setTags("");
                            setLat("");
                            setLng("");
                            setFacilities("");
                            setStarRating("0");
                            setRedirectUrl("");
                            setEntryFee("0");
                            setOpeningHours("09:00");
                            setClosingHours("21:00");
                            setCuisineType("");
                            setContactInfo("");
                            setResponseData(null);
                            setErrorMsg("");
                        }}
                        disabled={loading}
                    >
                        ล้างฟอร์ม
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "กำลังบันทึก..." : "บันทึก"}
                    </Button>
                </div>

                {/* Result / Error */}
                {/* {errorMsg ? (
                    <div className="p-3 text-sm text-red-700 border border-red-300 rounded-md bg-red-50">
                        ⚠️ {errorMsg}
                    </div>
                ) : null} */}

                {responseData ? (
                    <div className="w-full">
                        <h3 className="mb-2 text-lg font-semibold">ผลลัพธ์จาก API</h3>
                        <div className="p-4 overflow-auto text-sm border rounded-lg border-neutral-800 bg-neutral-900 text-neutral-100">
                            <pre>{JSON.stringify(responseData, null, 2)}</pre>
                        </div>
                    </div>
                ) : null}
            </form>
        </div>
    );
}
