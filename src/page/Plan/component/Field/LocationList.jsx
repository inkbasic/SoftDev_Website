import { useEffect, useState } from "react";
import Location from "./Location";
import TravelTime from "./TravelTime";
import { computeTravelTimes } from "@/lib/routeService";

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
}) {
  const [computed, setComputed] = useState([]);

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
        <div key={location.id} className="relative">
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
      ))}
    </div>
  );
}