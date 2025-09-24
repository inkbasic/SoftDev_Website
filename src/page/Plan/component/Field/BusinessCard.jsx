import Pool from "../../../../../public/img/pool.jpg";
import { Star } from "lucide-react";
export default function BusinessCard({ showStar }) {
	return (
		<>
			<div className="w-full flex flex-col gap-2">
				<div className="relative w-full h-30 rounded-[8px] overflow-hidden">
					<img src={Pool} className="object-cover w-full h-full" />
					{showStar && (
						<div className="absolute flex items-center gap-1 bg-paper rounded-[4px] px-1 h-3 top-1 left-1">
							<Star className="w-2 h-2" fill="currentColor" />
							<p className="text-[8px]!">8.4 (4103)</p>
						</div>
					)}
				</div>
				<div>
					<p>โรงแรมพูลแมน</p>
					<p className="text-[12px]! text-neutral-400">14 กม. จากตัวเมือง</p>
				</div>
			</div>
		</>
	);
}