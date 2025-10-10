import { useEffect, useState } from "react";
import Location from "./Location";
import TravelTime from "./TravelTime";
import { computeTravelTimes } from "@/lib/routeService";

export default function LocationList({ locations = [], travelTimes = [], isEditing, onRemove, onReorder, onStayChange, onTimeChange }) {
  const [computed, setComputed] = useState([]);
  const [overIndex, setOverIndex] = useState(null); // ไฮไลต์ตอนลากวาง

  useEffect(() => {
    const abort = new AbortController();
    (async () => {
      try {
        const result = await computeTravelTimes(locations, abort.signal);
        setComputed(result);
      } catch {
        setComputed([]);
      }
    })();
    return () => abort.abort();
  }, [locations]);

  const times = computed.length ? computed : travelTimes;

  return (
    <div className="flex flex-col">
      {locations.map((location, index) => (
        <div
          key={`${location.id}-${index}`}
          data-index={index}
          onDragOver={(e) => {
            if (!isEditing) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setOverIndex(index);
          }}
          onDragLeave={() => setOverIndex(null)}
          onDrop={(e) => {
            if (!isEditing) return;
            e.preventDefault();
            setOverIndex(null);
            const fromStr = e.dataTransfer.getData("text/plain");
            const from = Number(fromStr);
            if (Number.isNaN(from) || from === index) return;
            onReorder?.(from, index);
          }}
          className={`relative transition-colors ${overIndex === index ? "ring-2 ring-blue-300 rounded-lg" : ""}`}
        >
          <Location
            index={index} // ส่ง index ให้ตัวจับลาก
            locationData={location}
            isEditing={isEditing}
            onRemove={() => onRemove?.(location.id)}
            onReorder={(direction) => {
              if (direction === "up" && index > 0) onReorder?.(index, index - 1);
              if (direction === "down" && index < locations.length - 1) onReorder?.(index, index + 1);
            }}
            canMoveUp={index > 0}
            canMoveDown={index < locations.length - 1}
            onStayChange={(mins) => onStayChange?.(index, mins)}
            onTimeChange={(start, end) => onTimeChange?.(index, start, end)}
          />
          {index < locations.length - 1 && (
            <TravelTime data={times?.[index]} />
          )}
        </div>
      ))}
    </div>
  );
}