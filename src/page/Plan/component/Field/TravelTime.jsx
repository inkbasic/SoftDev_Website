import { ChevronsDown, Car } from "lucide-react";

export default function TravelTime({ data }) {
  if (!data) {
    return (
      <div className="flex items-center gap-2 text-neutral-400">
        <ChevronsDown stroke="#A3A3A3" />
        <Car stroke="#A3A3A3" />
        <p className="text-neutral-400">กำลังคำนวณเส้นทาง...</p>
      </div>
    );
  }

  const minutes = Math.round(data.durationMin ?? 0);
  const km = (data.distanceKm ?? 0).toFixed(1);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const timeStr = h > 0 ? `${h} ชม. ${m} นาที` : `${m} นาที`;

  return (
    <div className="flex items-center gap-2">
      <ChevronsDown stroke="#A3A3A3" />
      <Car stroke="#A3A3A3" />
      <p className="text-neutral-400">{timeStr} - ระยะทาง {km} กม.</p>
    </div>
  );
}