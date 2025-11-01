import { useEffect, useMemo, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

function getToken() {
  return (
    localStorage.getItem("jwtToken") ||
    sessionStorage.getItem("jwtToken") ||
    "jwtToken"
  );
}

// ดึงรายการผู้ให้บริการรถเช่า
async function fetchCarRentals(signal) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token && token !== "jwtToken" && token.split(".").length === 3) {
    headers.Authorization = `Bearer ${token}`;
  }
  // พยายามเรียก endpoint หลักก่อน ถ้าไม่สำเร็จจะ fallback ไป defaultProviders
  const endpoints = [
    `${BASE_URL}/car-rentals`,
    `${BASE_URL}/rentals`,
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, { method: "GET", headers, signal });
      const raw = await res.text();
      let body; try { body = raw ? JSON.parse(raw) : null; } catch { body = raw; }
      if (res.ok && Array.isArray(body)) {
        return body.map((p) => ({
          providerId: p.providerId || p._id || p.id,
          name: p.name,
          link: p.link || p.url,
          imageUrl: p.imageUrl || p.image,
        })).filter(x => x && x.providerId && x.name);
      }
    } catch (_) { /* try next */ }
  }
  // fallback ตัวอย่าง 2 เจ้า
  return [
    {
      providerId: "prov_thairentacar",
      name: "Thai Rent A Car",
      link: "https://thairentacar.com/",
      imageUrl: "/img/rental_thairentacar.png",
    },
    {
      providerId: "prov_drivehub",
      name: "DriveHub",
      link: "https://www.drivehub.co/",
      imageUrl: "/img/rental_drivehub.png",
    },
  ];
}

export default function CarSection({ value, onChange }) {
  // value รูปแบบ: { type: 'personal' | 'rental', rental?: { providerId, name, link, imageUrl } }
  const [mode, setMode] = useState(value?.type || "personal");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // sync เมื่อ parent เปลี่ยน (กรณีโหลดจาก server)
    if (value?.type && value?.type !== mode) setMode(value.type);
  }, [value?.type]);

  useEffect(() => {
    if (mode === "personal") {
      onChange?.({ type: "personal" });
      return;
    }
    // rental mode: โหลด providers
    const abort = new AbortController();
    setLoading(true); setError("");
    fetchCarRentals(abort.signal)
      .then((list) => setProviders(list || []))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false));
    return () => abort.abort();
  }, [mode]);

  const selectedId = value?.rental?.providerId || null;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between w-full">
        <h3>การเดินทางด้วยรถ</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="car-mode"
              checked={mode === "personal"}
              className="cursor-pointer"
              onChange={() => setMode("personal")}
            />
            รถยนต์ส่วนตัว
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="car-mode"
              checked={mode === "rental"}
              className="cursor-pointer"
              onChange={() => setMode("rental")}
            />
            รถเช่า
          </label>
        </div>
      </div>

      {mode === "rental" && (
        <div className="w-full">
          {loading ? (
            <p className="text-neutral-500">กำลังโหลดผู้ให้บริการ…</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex gap-3 py-2">
              {(providers || []).map((p) => (
                <div key={p.providerId} className={`basis-1/2 bg-white border border-neutral-200 rounded-[8px] overflow-hidden shadow-sm ${selectedId === p.providerId ? 'ring-2 ring-blue-400' : ''}`}>
                  <div className="h-32 bg-neutral-100 overflow-hidden">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} className="object-cover w-full h-full" alt={p.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold truncate" title={p.name}>{p.name}</p>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-600 text-sm whitespace-nowrap">เปิดเว็บ</a>
                      )}
                    </div>
                    <button
                      className={`px-3 py-1 rounded-md text-sm cursor-pointer ${selectedId === p.providerId ? 'bg-blue-600 text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`}
                      onClick={() => onChange?.({ type: "rental", rental: { ...p } })}
                    >
                      {selectedId === p.providerId ? 'เลือกแล้ว' : 'เลือก'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
