import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
  onTimeChange 
}) {
  const [computed, setComputed] = useState([]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = locations.findIndex(location => location.id === active.id);
      const newIndex = locations.findIndex(location => location.id === over.id);
      
      onReorder?.(oldIndex, newIndex);
    }
  }

  // สร้าง items สำหรับ SortableContext
  const sortableItems = locations.map(location => location.id);

  return (
    <div className="flex flex-col">
      {isEditing ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
            {locations.map((location, index) => (
              <div key={location.id} className="relative">
                <Location
                  index={index}
                  locationData={location}
                  isEditing={isEditing}
                  onRemove={() => onRemove?.(location.id)}
                  onStayChange={(mins) => onStayChange?.(index, mins)}
                  onTimeChange={(start, end) => onTimeChange?.(index, start, end)}
                />
                {index < locations.length - 1 && (
                  <TravelTime data={times?.[index]} />
                )}
              </div>
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        // แสดงแบบปกติเมื่อไม่ได้แก้ไข
        locations.map((location, index) => (
          <div key={location.id} className="relative">
            <Location
              index={index}
              locationData={location}
              isEditing={isEditing}
              onRemove={() => onRemove?.(location.id)}
              onStayChange={(mins) => onStayChange?.(index, mins)}
              onTimeChange={(start, end) => onTimeChange?.(index, start, end)}
            />
            {index < locations.length - 1 && (
              <TravelTime data={times?.[index]} />
            )}
          </div>
        ))
      )}
    </div>
  );
}