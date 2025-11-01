import { ChevronDown, Check, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function DropDownMulti({
	placeholder = "เลือกหลายรายการ",
	value = [],
	onChange,
	options = [],
	maxSelected,
}) {
	const [open, setOpen] = useState(false);
	const [q, setQ] = useState("");
	const ref = useRef(null);

	const selected = useMemo(() => new Set(value || []), [value]);
	const filtered = useMemo(
		() => options.filter(o => o.toLowerCase().includes(q.toLowerCase())),
		[options, q]
	);

	const toggle = (opt) => {
		const next = new Set(selected);
		if (next.has(opt)) {
			next.delete(opt);
		} else {
			if (!maxSelected || next.size < maxSelected) next.add(opt);
		}
		onChange?.(Array.from(next));
	};

	const clearAll = () => onChange?.([]);
	const selectAll = () => onChange?.(filtered);

	useEffect(() => {
		const onDoc = (e) => {
			if (!ref.current) return;
			if (!ref.current.contains(e.target)) setOpen(false);
		};
		if (open) document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, [open]);

	return (
		<div ref={ref} className="relative">
			<div
				className="flex px-5 justify-between items-center gap-3 w-full py-5 bg-white border border-gray-300 rounded-xl cursor-pointer"
				onClick={() => setOpen(o => !o)}
			>
				<div className="flex flex-wrap gap-2 items-center">
					{selected.size === 0 ? (
						<p className="font-bold">{placeholder} <span className="text-red-500">*</span></p>
					) : (
						Array.from(selected).map(opt => (
							<span
								key={opt}
								className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200"
								onClick={(e) => e.stopPropagation()}
							>
								{opt}
								<button
									type="button"
									className="hover:text-blue-900"
									onClick={(e) => { e.stopPropagation(); toggle(opt); }}
									aria-label={`ลบ ${opt}`}
								>
									<X className="w-4 h-4" />
								</button>
							</span>
						))
					)}
				</div>
				<ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
			</div>

			{open && (
				<div className="absolute z-50 mt-1 w-full left-0 top-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-lg">
					<div className="p-2 border-b border-neutral-200">
						<input
							type="text"
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="ค้นหา..."
							className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
							onClick={(e) => e.stopPropagation()}
						/>
						<div className="mt-2 flex gap-2">
							<button
								type="button"
								className="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
								onClick={(e) => { e.stopPropagation(); selectAll(); }}
							>
								เลือกทั้งหมด
							</button>
							<button
								type="button"
								className="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
								onClick={(e) => { e.stopPropagation(); clearAll(); }}
							>
								ล้างทั้งหมด
							</button>
						</div>
					</div>

					<ul className="max-h-52 overflow-auto scroll-auto-hide">
						{filtered.length === 0 && (
							<li className="px-3 py-2 text-gray-400">ไม่พบรายการ</li>
						)}
						{filtered.map(opt => {
							const isSel = selected.has(opt);
							return (
								<li
									key={opt}
									className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 ${isSel ? "bg-blue-50" : ""}`}
									onClick={(e) => { e.stopPropagation(); toggle(opt); }}
								>
									<span className={`w-4 h-4 border rounded-sm flex items-center justify-center ${isSel ? "bg-accent border-blue-600" : "border-gray-300"}`}>
										{isSel && <Check className="w-3 h-3 text-white" />}
									</span>
									<span className="text-sm">{opt}</span>
								</li>
							);
						})}
					</ul>

					<div className="p-2 border-t border-neutral-200 text-sm text-gray-600 flex justify-between items-center">
						<span>เลือกแล้ว {selected.size} รายการ</span>
						<button
							type="button"
							className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
							onClick={(e) => { e.stopPropagation(); setOpen(false); }}
						>
							ปิด
						</button>
					</div>
				</div>
			)}
		</div>
	);
}