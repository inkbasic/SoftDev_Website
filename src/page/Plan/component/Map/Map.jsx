import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// แก้ไข default icon ของ Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// คลิกบนแผนที่แล้วส่ง latlng กลับ
function MapClickHandler({ onClick }) {
    const map = useMap();
    useEffect(() => {
        if (!onClick) return;
        const handler = (e) => onClick(e.latlng, e);
        map.on('click', handler);
        return () => map.off('click', handler);
    }, [map, onClick]);
    return null;
}

// ปรับมุมมองให้พอดีกับ marker ทั้งหมด
function FitToMarkers({ markers, padding = [24, 24] }) {
    const map = useMap();
    useEffect(() => {
        if (!markers || markers.length === 0) return;
        const points = markers.map((m) => m.position).filter(Boolean);
        if (points.length === 0) return;
        const bounds = L.latLngBounds(points);
        if (bounds.isValid()) map.fitBounds(bounds, { padding });
    }, [map, markers, padding]);
    return null;
}

/**
 * Map component สำหรับ Leaflet (ผ่าน react-leaflet)
 *
 * Props:
 * - center: [lat, lng] (ค่าเริ่มต้น: กรุงเทพฯ)
 * - zoom: number (ค่าเริ่มต้น: 13)
 * - markers: [{ position: [lat, lng], popup?: string | ReactNode, draggable?: boolean, eventHandlers?: object, icon?: L.Icon }]
 * - fitToMarkers: boolean (ค่าเริ่มต้น: true)
 * - tileUrl: string (ค่าเริ่มต้น: OSM)
 * - tileAttribution: string
 * - onMapClick: (latlng, originalEvent) => void
 * - className, style
 * - children: ReactNode (เช่น Layer อื่นๆ)
 */

export default function Map({ center = [13.7563, 100.5018] }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const currentLocationMarkerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // สร้าง map instance
        mapInstanceRef.current = L.map(mapRef.current).setView(center, 13);

        // เพิ่ม tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
            }
        };
    }, []);

    // อัพเดต marker ตำแหน่งปัจจุบันเมื่อ center เปลี่ยน
    useEffect(() => {
        if (!mapInstanceRef.current || !center) return;

        // ลบ marker เก่า (ถ้ามี)
        if (currentLocationMarkerRef.current) {
            mapInstanceRef.current.removeLayer(currentLocationMarkerRef.current);
        }

        // สร้าง custom icon สำหรับตำแหน่งปัจจุบัน
        const currentLocationIcon = L.divIcon({
            className: 'current-location-marker',
            html: `
                <div style="
                    background: #4285f4;
                    border: 3px solid white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    position: relative;
                ">
                    <div style="
                        background: rgba(66, 133, 244, 0.2);
                        border: 1px solid #4285f4;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        position: absolute;
                        top: -13px;
                        left: -13px;
                        animation: pulse 2s infinite;
                    "></div>
                </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // เพิ่ม marker ตำแหน่งปัจจุบัน
        currentLocationMarkerRef.current = L.marker(center, {
            icon: currentLocationIcon
        })
        .addTo(mapInstanceRef.current)

        // เลื่อนแผนที่ไปยังตำแหน่งใหม่
        mapInstanceRef.current.setView(center, 15);

    }, [center]);

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full" />
            
            {/* CSS สำหรับ animation */}
            <style jsx>{`
                @keyframes pulse {
                    0% {
                        transform: scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2.0);
                        opacity: 0;
                    }
                }
                
                .current-location-marker {
                    background: transparent !important;
                    border: none !important;
                }
            `}</style>
        </div>
    );
}