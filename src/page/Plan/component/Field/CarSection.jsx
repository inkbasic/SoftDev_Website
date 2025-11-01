import { useEffect, useMemo, useState } from "react";
import { getDefaultTransportMethods } from "@/lib/transportService";

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
		// rental mode: โหลดรายชื่อ transport methods ตามที่ backend กำหนดไว้ 2 รายการ
		const abort = new AbortController();
		setLoading(true); setError("");
		getDefaultTransportMethods(abort.signal)
			.then((list) => setProviders(list || []))
			.catch((e) => { console.warn(e); setProviders([]); setError(""); })
			.finally(() => setLoading(false));
		return () => abort.abort();
	}, [mode]);

	// ใช้ method id ที่ไม่ซ้ำเป็นตัวอ้างอิง เพื่อหลีกเลี่ยงกรณี providerId ซ้ำกันหลาย method
	const selectedId = value?.rental?.methodId || value?.rental?.id || value?.rental?._id || value?.rental?.providerId || null;

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
							{(providers || []).map((p) => {
								const cardId = p.id || p._id || p.providerId;
								return (
									<div key={cardId} className={`basis-1/2 bg-white border border-neutral-200 rounded-[8px] overflow-hidden shadow-sm ${selectedId === cardId ? 'ring-2 ring-blue-400' : ''}`}>
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
												{p.contactInfo && (
													<a href={p.contactInfo} target="_blank" rel="noreferrer" className="text-blue-600 text-sm whitespace-nowrap">{p.hasBooking ? 'ไปจอง' : 'ติดต่อ'}</a>
												)}
											</div>
											<button
												className={`px-3 py-1 rounded-md text-sm cursor-pointer ${selectedId === cardId ? 'bg-blue-600 text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`}
												onClick={() => onChange?.({ type: "rental", rental: { methodId: p.id || p._id, providerId: p.providerId, name: p.name, imageUrl: p.imageUrl, contactInfo: p.contactInfo, hasBooking: p.hasBooking } })}
											>
												{selectedId === cardId ? 'เลือกแล้ว' : 'เลือก'}
											</button>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
