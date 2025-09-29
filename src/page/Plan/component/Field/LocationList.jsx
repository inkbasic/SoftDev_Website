import { useEffect, useState } from "react";
import Location from "./Location";
import TravelTime from "./TravelTime";
import { computeTravelTimes } from "@/lib/routeService";

export default function LocationList({ locations = [], travelTimes = [], isEditing, onRemove, onReorder }) {
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
                <div key={`${location.id}-${index}`} className="relative">
                    <Location
                        locationData={location}
                        isEditing={isEditing}
                        onRemove={() => onRemove?.(location.id)}
                        onReorder={(direction) => {
                            if (direction === "up" && index > 0) onReorder?.(index, index - 1);
                            if (direction === "down" && index < locations.length - 1) onReorder?.(index, index + 1);
                        }}
                        canMoveUp={index > 0}
                        canMoveDown={index < locations.length - 1}
                    />
                    {index < locations.length - 1 && (
                        <TravelTime data={times?.[index]} />
                    )}
                </div>
            ))}
        </div>
    );
}