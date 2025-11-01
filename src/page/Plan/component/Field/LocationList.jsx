import { useEffect, useState } from "react";
import Location from "./Location";
import TravelTime from "./TravelTime";
import { computeTravelTimes, getTravelBetween } from "@/lib/routeService";

export default function LocationList({ 
  locations = [], 
  travelTimes = [], 
  isEditing, 
  onRemove, 
  onReorder, 
  onStayChange, 
  onTimeChange,
  enableDragDrop = true,
  baseOrderOffset = 0,
  prevLastLocation = null,
}) {
  const [computed, setComputed] = useState([]);
  const [topTravel, setTopTravel] = useState(null);

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

  // คำนวณเวลาเดินทางจากวันก่อนหน้า → สถานที่แรกของวันนี้ (ถ้ามี)
  useEffect(() => {
    const abort = new AbortController();
    (async () => {
      try {
        if (!prevLastLocation || !locations?.[0]) {
          setTopTravel(null);
          return;
        }
        const route = await getTravelBetween(prevLastLocation, locations[0], abort.signal);
        setTopTravel(route || null);
      } catch {
        setTopTravel(null);
      }
    })();
    return () => abort.abort();
  }, [prevLastLocation, locations && locations[0]]);

  const times = computed.length ? computed : travelTimes;

  return (
    <div className="flex flex-col">
      {/* แสดงเวลาเดินทางจากวันก่อนหน้า → สถานที่แรกของวันนี้ */}
      {prevLastLocation && locations.length > 0 && (
        <div className="relative">
          <TravelTime data={topTravel} />
        </div>
      )}

      {locations.map((location, index) => {
        // Use a composite, per-instance key to avoid duplicates when the same place appears multiple times in a day
        const key = `${location?.id ?? 'loc'}:${location?.order ?? index}`;
        return (
        <div key={key} className="relative">
          <Location
            index={index}
            locationData={location}
            isEditing={isEditing}
            onRemove={() => onRemove?.(location.id)}
            onStayChange={(mins) => onStayChange?.(index, mins)}
            onTimeChange={(start, end) => onTimeChange?.(index, start, end)}
            displayOrder={baseOrderOffset + index + 1}
          />
          {index < locations.length - 1 && (
            <TravelTime data={times?.[index]} />
          )}
        </div>
      );})}
    </div>
  );
}