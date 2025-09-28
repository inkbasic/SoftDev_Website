import Location from "./Location";
import TravelTime from "./TravelTime";

export default function LocationList({ locations = [], travelTimes = [], isEditing, onRemove, onReorder }) {
    return (
        <div className="flex flex-col">
            {locations.map((location, index) => (
                <div key={location.id} className="relative">
                    <Location
                        locationData={location}
                        isEditing={isEditing}
                        onRemove={() => onRemove?.(location.id)}
                        onReorder={(direction) => {
                            if (direction === 'up' && index > 0) onReorder?.(index, index - 1);
                            if (direction === 'down' && index < locations.length - 1) onReorder?.(index, index + 1);
                        }}
                        canMoveUp={index > 0}
                        canMoveDown={index < locations.length - 1}
                    />
                    {travelTimes[index] && <TravelTime data={travelTimes[index]} />}
                </div>
            ))}
        </div>
    );
}