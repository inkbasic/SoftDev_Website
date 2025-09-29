"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
    InputField,
    TextAreaField,
    FormSection,
    ReusableSelect,
    hhmmToApiISO,
    getToken,
} from "@/page/AddLocation/component/FormPieces";

/* ===================== Utils ภายในไฟล์ ===================== */
const toTitle = (s = "") => s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const isFiniteNum = (v) => Number.isFinite(Number(v));
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/* ===================== Subcomponent: GroupBox ===================== */
function GroupBox({ title, items, values, onChange }) {
    const toggleOne = (val) => {
        if (values.includes(val)) onChange(values.filter((v) => v !== val));
        else onChange([...values, val]);
    };

    return (
        <section className="w-full">
            <header className="mb-2">
                <h5 className="text-lg">{title}</h5>
                <p className="text-sm text-muted-foreground">{values.length} selected</p>
            </header>

            <ScrollArea className="max-h-64">
                <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(items || []).map((v) => (
                        <div key={v} className="flex items-center gap-3 rounded-md px-2 py-1.5">
                            <Checkbox
                                id={`${title}-${v}`}
                                checked={values.includes(v)}
                                onCheckedChange={() => toggleOne(v)}
                            />
                            <Label htmlFor={`${title}-${v}`} className="text-sm cursor-pointer">
                                {toTitle(v)}
                            </Label>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </section>
    );
}

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

    /* ---------- type + tags (comma-separated) ---------- */
    const [type, setType] = useState("accommodation"); // "accommodation" | "attraction" | "restaurant"
    const [tags, setTags] = useState(""); // รวมค่าเลือกจาก GroupBox ทั้งหมดเป็นสตริงคั่นด้วยคอมมา

    /* ---------- state ฟอร์มร่วม ---------- */
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [locationStr, setLocationStr] = useState("");

    /* ---------- เฉพาะ accommodation ---------- */
    const [facilities, setFacilities] = useState("");
    const [starRating, setStarRating] = useState("0");
    const [redirectUrl, setRedirectUrl] = useState("");

    /* ---------- เฉพาะ attraction ---------- */
    const [entryFee, setEntryFee] = useState("0");

    /* ---------- เฉพาะ restaurant ---------- */
    const [openingHours, setOpeningHours] = useState("09:00"); // HH:mm
    const [closingHours, setClosingHours] = useState("21:00");
    const [cuisineType, setCuisineType] = useState("");
    const [contactInfo, setContactInfo] = useState("");

    /* ---------- Map label แสดงหัวข้อ ---------- */
    const typeLabelMap = useMemo(
        () => ({
            accommodation: "ที่พัก",
            attraction: "สถานที่ท่องเที่ยว",
            restaurant: "ร้านอาหาร",
        }),
        []
    );

    const [options, setOptions] = useState({
        groupType: [],
        preferences: [],
        accommodation: [],
        attraction: [],
        restaurant: [],
    });

    /* ---------- options ---------- */
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch("/tags", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken() || "jwtToken"}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                console.log(data);

                // เซ็ตข้อมูลเข้า state
                setOptions({
                    groupType: data.groupType || [],
                    preferences: data.preferences || [],
                    accommodation: data.accommodation || [],
                    attraction: data.attractions || [],
                    restaurant: data.food || [],
                });
            } catch (error) {
                console.error("Failed to fetch tags:", error);
            }
        };

        fetchTags();
    }, []);

    /* ---------- ตัวเลือก GroupBox ตาม type ---------- */
    const groupTypeOpts = options.groupType ?? [];
    const preferencesOpts = options.preferences ?? [];
    const categoryOpts = options?.[type] ?? [];

    /* ---------- selections ของ GroupBox ---------- */
    const [groupSel, setGroupSel] = useState([]);
    const [prefSel, setPrefSel] = useState([]);
    const [catSel, setCatSel] = useState([]);

    // เคลียร์ผลลัพธ์เมื่อเปลี่ยน type
    useEffect(() => {
        setResponseData(null);
        setErrorMsg("");
    }, [type]);

    // เมื่อ type/ตัวเลือกของหมวดเปลี่ยน → รักษา selection เฉพาะที่ยัง valid
    const catKey = useMemo(() => categoryOpts.join(","), [categoryOpts]);
    useEffect(() => {
        setCatSel((prev) => prev.filter((v) => categoryOpts.includes(v)));
    }, [type, catKey]);

    // รวมค่าจาก GroupBox → กลายเป็น comma-separated ใน tags
    useEffect(() => {
        const combined = [...groupSel, ...prefSel, ...catSel];
        setTags(combined.join(","));
    }, [groupSel, prefSel, catSel]);

    /* ---------- Builder / Validate / Submit ---------- */
    function buildBody() {
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
                location: locationStr.trim(),
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
                location: locationStr.trim(),
                description: description.trim(),
                tags: tagsArr,
                entryFee: Number(entryFee),
            };
        }

        // restaurant
        return {
            name: name.trim(),
            imageUrl: imageUrl.trim(),
            location: locationStr.trim(),
            description: description.trim(),
            tags: tagsArr,
            openingHours: hhmmToApiISO(openingHours),
            closingHours: hhmmToApiISO(closingHours),
            cuisineType: cuisineType.trim(),
            contactInfo: contactInfo.trim(),
        };
    }

    function validate(body) {
        if (!body.name) return "กรุณากรอกชื่อ";
        if (!body.imageUrl) return "กรุณากรอกลิงก์รูปภาพ (imageUrl)";
        if (!body.location) return "กรุณากรอก location (string)";
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
            const asISO = (s) => hhmmToApiISO(s);
            const ok = (iso) =>
                typeof iso === "string" && iso.startsWith("1970-01-01T") && /^\d{2}:\d{2}/.test(iso.slice(11));
            if (!ok(asISO(openingHours)) || !ok(asISO(closingHours))) {
                return "รูปแบบเวลาไม่ถูกต้อง (เช่น 09:00)";
            }
        }

        return null;
    }

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

    const previewPayload = useMemo(
        () => buildBody(),
        [
            name,
            imageUrl,
            description,
            tags,
            locationStr,
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

    return (
        <div className="flex flex-col items-center justify-center w-full gap-12 px-6 py-20 sm:px-12">
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

            {/* ฟอร์มหลัก */}
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-5xl gap-12">
                <FormSection
                    title={`กรอกข้อมูลสำหรับ “${typeLabelMap[type]}”`}
                    description="* จำเป็นต้องกรอก name, imageUrl, location (string), description"
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
                        <InputField
                            label="Location (string)"
                            id="location"
                            placeholder="เช่น 'Bangkok, Thailand' หรือ '100.5018,13.7563'"
                            value={locationStr}
                            onChange={(_, v) => setLocationStr(v)}
                        />
                        <TextAreaField
                            label="คำอธิบาย"
                            id="description"
                            placeholder="บรรยายสถานที่โดยย่อ..."
                            value={description}
                            onChange={(_, v) => setDescription(v)}
                        />

                        {/* ---------- Type-specific ---------- */}
                        {type === "accommodation" && (
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
                        )}

                        {type === "attraction" && (
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
                        )}

                        {type === "restaurant" && (
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
                        )}
                    </div>
                </FormSection>

                {/* ---------- กล่องเลือกแท็ก (GroupBox) ---------- */}
                <FormSection
                    title="แท็ก (เลือกหลายรายการ)"
                    description="เลือกรูปแบบกลุ่ม, ความชอบ และหมวดตามประเภท เพื่อช่วยให้ค้นหาได้ดีขึ้น"
                >
                    <div className="flex flex-col gap-8">
                        <GroupBox title="Group Type" items={groupTypeOpts} values={groupSel} onChange={setGroupSel} />
                        <GroupBox title="Preferences" items={preferencesOpts} values={prefSel} onChange={setPrefSel} />
                        <GroupBox title={toTitle(type)} items={categoryOpts} values={catSel} onChange={setCatSel} />
                    </div>

                    {/* เก็บค่า tags (comma-separated) เพื่อส่งไปกับฟอร์ม */}
                    <input type="hidden" name="tags" value={tags} />

                    {/* แสดงตัวอย่างค่า tags ที่จะส่ง */}
                    <div className="mt-16 text-sm text-muted-foreground">
                        <b>tags:</b> {tags || "(none)"}
                    </div>
                </FormSection>

                {/* ---------- Preview Payload ---------- */}
                <FormSection title="ตัวอย่างข้อมูลที่จะส่ง (Preview)" description="ตรวจสอบก่อนกดบันทึก">
                    <pre className="max-h-[320px] overflow-auto rounded-lg bg-neutral-900 p-4 text-sm text-neutral-100">
                        {JSON.stringify(previewPayload, null, 2)}
                    </pre>
                </FormSection>

                {/* ---------- Actions ---------- */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setName("");
                            setImageUrl("");
                            setDescription("");
                            setTags("");
                            setLocationStr("");
                            setFacilities("");
                            setStarRating("0");
                            setRedirectUrl("");
                            setEntryFee("0");
                            setOpeningHours("09:00");
                            setClosingHours("21:00");
                            setCuisineType("");
                            setContactInfo("");
                            setGroupSel([]);
                            setPrefSel([]);
                            setCatSel([]);
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
