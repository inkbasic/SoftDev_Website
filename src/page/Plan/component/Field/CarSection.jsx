import { useEffect, useMemo, useState } from "react";
import { getDefaultTransportMethods } from "@/lib/transportService";

export default function CarSection({ value, onChange, transportation, isEditing = true }) {
	// value รูปแบบ: { type: 'personal' | 'rental', rental?: { providerId, name, link, imageUrl } }
	const [mode, setMode] = useState(value?.type || "personal");
	const [providers, setProviders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [needProviderWarn, setNeedProviderWarn] = useState(false);

	// คำนวณโหมดจากทั้ง value และ transportation (รองรับ transportation เป็น object)
	const derivedMode = useMemo(() => {
		if (value?.type) return value.type;
		if (transportation && typeof transportation === 'object') {
			if (transportation.type === 'rental' || transportation.rental) return 'rental';
		}
		if (transportation === 'รถเช่า') return 'rental';
		return 'personal';
	}, [value?.type, transportation]);

	useEffect(() => {
		if (derivedMode !== mode) setMode(derivedMode);
	}, [derivedMode]);

		useEffect(() => {
			if (mode === "personal") {
				// ไม่ push การเปลี่ยนแปลงโดยอัตโนมัติ ปล่อยให้เกิดจากการกด radio
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

	// helper: normalize id to string from various shapes (string | number | { _id } | { id })
	const toId = (v) => {
		if (v == null) return null;
		if (typeof v === 'string' || typeof v === 'number') return String(v);
		if (typeof v === 'object') {
			const raw = v._id ?? v.id;
			return raw != null ? String(raw) : null;
		}
		return null;
	};
	// ใช้ method id ที่ไม่ซ้ำเป็นตัวอ้างอิง เพื่อหลีกเลี่ยงกรณี providerId ซ้ำกันหลาย method
	const selectedId = (
		toId(value?.rental?.methodId) ||
		toId(value?.rental?.id) ||
		toId(value?.rental?._id) ||
		(transportation && typeof transportation === 'object' && transportation.rental
			? (toId(transportation.rental.methodId) || toId(transportation.rental.id) || toId(transportation.rental._id))
			: null)
	) || null;
	
	// สร้างตัวช่วยดึงข้อมูลรถเช่าที่เลือก (จาก value หรือ transportation)
	const selectedRental = useMemo(() => {
		if (value?.rental) return value.rental;
		if (transportation && typeof transportation === 'object' && transportation.rental) {
			return transportation.rental;
		}
		return null;
	}, [value?.rental, transportation]);

	// สร้างข้อมูลสำหรับแสดงผล: ถ้า selectedRental ไม่มีชื่อ/รูป ให้เติมจาก providers ที่โหลดมา (อิง selectedId)
	const displayRental = useMemo(() => {
		const hasInfo = selectedRental && (selectedRental.name || selectedRental.imageUrl || selectedRental.contactInfo);
		if (hasInfo) return selectedRental;
		if (!selectedId) return selectedRental;
		const match = (providers || []).find(p => String(p.id || p._id) === String(selectedId));
		if (!match) return selectedRental;
		return {
			...selectedRental,
			methodId: selectedRental?.methodId ?? selectedId,
			name: selectedRental?.name ?? match.name,
			imageUrl: selectedRental?.imageUrl ?? match.imageUrl,
			contactInfo: selectedRental?.contactInfo ?? match.contactInfo,
			hasBooking: selectedRental?.hasBooking ?? match.hasBooking,
			providerId: selectedRental?.providerId ?? match.providerId,
		};
	}, [selectedRental, providers, selectedId]);

	return (
		<div className="w-full flex flex-col gap-3">
			<div className="flex items-center justify-between w-full">
				<h3>การเดินทาง</h3>
				{isEditing ? (
					<div className="flex gap-4">
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								name="car-mode"
								checked={mode === "personal"}
								className="cursor-pointer"
								onChange={() => { if (!isEditing) return; setNeedProviderWarn(false); setMode("personal"); onChange?.({ type: "personal" }); }}
							/>
							รถยนต์ส่วนตัว
						</label>
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								name="car-mode"
								checked={mode === "rental"}
								className="cursor-pointer"
								onChange={() => { if (!isEditing) return; setMode("rental"); onChange?.({ type: "rental", rental: value?.rental }); if (!selectedId) setNeedProviderWarn(true); }}
							/>
							รถเช่า
						</label>
					</div>
				) : (
					<h3 className="text-neutral-600">
						{mode === 'rental' ? 'รถเช่า' : 'รถยนต์ส่วนตัว'}
					</h3>
				)}
			</div>

			{isEditing && mode === 'rental' && needProviderWarn && (
				<p className="text-amber-600 text-sm mt-1">โปรดเลือกผู้ให้บริการรถเช่าด้านล่าง</p>
			)}

			{mode === "rental" && (
				<div className="w-full">
					{!isEditing && displayRental ? (
						// โหมดดูอย่างเดียว: แสดงเฉพาะรถเช่าที่เลือก
						<div className="flex gap-3 py-2">
							<div className="basis-1/2 bg-white border border-neutral-200 rounded-[8px] overflow-hidden shadow-sm ring-2 ring-blue-400">
								<div className="h-32 bg-neutral-100 overflow-hidden">
									{displayRental.imageUrl ? (
										<img src={displayRental.imageUrl} className="object-cover w-full h-full" alt={displayRental.name || 'Selected rental'} />
									) : (
										<div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
									)}
								</div>
								<div className="p-3 flex flex-col gap-2">
									<div className="flex items-center justify-between gap-2">
										<p className="font-bold truncate" title={displayRental.name}>{displayRental.name || 'ผู้ให้บริการรถเช่าที่เลือก'}</p>
										{displayRental.contactInfo && (
											<a href={displayRental.contactInfo} target="_blank" rel="noreferrer" className="text-blue-600 text-sm whitespace-nowrap pr-1">{displayRental.hasBooking ? 'เยี่ยมชม' : 'ติดต่อ'}</a>
										)}
									</div>
								</div>
							</div>
						</div>
					) : !isEditing && !displayRental ? (
						<p className="text-neutral-500 py-2">ยังไม่ได้เลือกผู้ให้บริการรถเช่า</p>
					) : loading ? (
						<p className="text-neutral-500">กำลังโหลดผู้ให้บริการ…</p>
					) : error ? (
						<p className="text-red-500">{error}</p>
					) : (
						<div className="flex gap-3 py-2">
							{(providers || []).map((p) => {
								const cardId = String(p.id || p._id);
								// ถ้าอยู่ในโหมดแก้ไข แสดงทุกรายการให้เลือก; ถ้าไม่ใช่ ให้โชว์เฉพาะที่เลือก (handled earlier)
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
													<a href={p.contactInfo} target="_blank" rel="noreferrer" className="text-blue-600 text-sm whitespace-nowrap pr-1">{p.hasBooking ? 'เยี่ยมชม' : 'ติดต่อ'}</a>
												)}
											</div>
											<button
											className={`px-3 py-1 rounded-md text-sm cursor-pointer ${selectedId === cardId ? 'bg-blue-600 text-white' : 'bg-neutral-100 hover:bg-neutral-200'} ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
												onClick={() => { if (!isEditing) return; setNeedProviderWarn(false); onChange?.({ type: "rental", rental: { methodId: p.id || p._id, providerId: p.providerId, name: p.name, imageUrl: p.imageUrl, contactInfo: p.contactInfo, hasBooking: p.hasBooking } }); }}
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
