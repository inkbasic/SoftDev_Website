import Pool from "../../../../../public/img/pool.jpg";
import { GripVertical, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export default function Location({
	locationData,
	isEditing = false,
	onRemove,
	onReorder,
	canMoveUp = false,
	canMoveDown = false
}) {
	const {
		name = "Siam Paragon",
		openHours = "เปิด 10.00 - 22.00",
		description = "ห้างสรรพสินค้าขนาดใหญ่ที่มีร้านบูติกระดับไฮเอนด์และร้านทั่วไป ร้านอาหาร โบว์ลิ่ง และโรงภาพยนตร์มัลติเพล็กซ์",
		image = Pool,
		order = 1,
		rating = 0
	} = locationData || {};

	return (
		<div className="flex gap-2 h-40 w-full bg-white relative">
			<div className="flex flex-col gap-2 px-5 py-3 rounded-[8px] border border-neutral-200 w-full h-full relative">
				<div className="flex justify-between items-start">
					<div className="flex-1">
						<p className="font-bold">{name}</p>
						<p className="text-sm text-neutral-600">{openHours}</p>
						{rating > 0 && (
							<p className="text-sm text-yellow-600">⭐ {rating}/5</p>
						)}
					</div>
				</div>

				<p className="text-neutral-500 text-sm line-clamp-3">{description}</p>

				{/* ปุ่มจัดการ (แสดงเฉพาะเมื่อแก้ไข) */}
				{isEditing && (
					<>
						<GripVertical
							className="absolute -left-6 top-1/2 transform -translate-y-1/2 cursor-move text-neutral-400"
						/>
						<button
							onClick={onRemove}
							className="absolute cursor-pointer -right-60 top-1/2 transform -translate-y-1/2 p-1 rounded text-neutral-400 hover:text-red-500 transition-colors duration-200"
							title="ลบสถานที่"
						>
							<Trash2 className="w-5 h-5" />
						</button>
					</>
				)}

				{/* หมายเลขลำดับ */}
				<div className="absolute -left-3 top-3 text-sm text-white bg-accent w-6 h-6 flex items-center justify-center rounded-full text-center font-bold">
					{order}
				</div>
			</div>

			{/* รูปภาพ */}
			<div className="flex items-center w-76 h-full bg-neutral-200 rounded-[8px] justify-center overflow-hidden">
				<img src={image} className="object-cover w-full h-full" alt={name} />
			</div>
		</div>
	);
}