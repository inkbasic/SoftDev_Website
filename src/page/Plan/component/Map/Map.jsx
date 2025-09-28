import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { Plus, Minus, MapPin, Navigation } from 'lucide-react';

// แก้ไข default icon ของ Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Map({ center = [13.7563, 100.5018] }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const currentLocationMarkerRef = useRef(null);
    const [currentZoom, setCurrentZoom] = useState(13);

    useEffect(() => {
        if (!mapRef.current) return;

        // สร้าง map instance (ปิด default zoom control)
        mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: false // ปิด default zoom control
        }).setView(center, 13);

        // เพิ่ม tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);

        // เพิ่ม event listener สำหรับ zoom
        mapInstanceRef.current.on('zoomend', () => {
            setCurrentZoom(mapInstanceRef.current.getZoom());
        });

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
                <div class="current-location-dot">
                    <div class="current-location-pulse"></div>
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
        .bindPopup('ตำแหน่งปัจจุบันของคุณ');

    }, [center]);

    // ฟังก์ชัน zoom
    const handleZoomIn = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.zoomOut();
        }
    };

    // ฟังก์ชันไปยังตำแหน่งปัจจุบัน
    const handleGoToCurrentLocation = () => {
        if (mapInstanceRef.current && center) {
            mapInstanceRef.current.setView(center, 15);
        }
    };

    // ฟังก์ชัน fit bounds (ถ้ามี markers หลายตัว)
    const handleFitView = () => {
        if (mapInstanceRef.current && currentLocationMarkerRef.current) {
            const bounds = L.latLngBounds([center]);
            mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
        }
    };

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full" />
            
            {/* Custom Zoom Controls */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                {/* Zoom In Button */}
                <button
                    onClick={handleZoomIn}
                    className="bg-white cursor-pointer hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-md transition-colors duration-200"
                    title="ขยายแผนที่"
                >
                    <Plus className="w-5 h-5 text-gray-700" />
                </button>

                {/* Zoom Out Button */}
                <button
                    onClick={handleZoomOut}
                    className="bg-white cursor-pointer hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-md transition-colors duration-200"
                    title="ย่อแผนที่"
                >
                    <Minus className="w-5 h-5 text-gray-700" />
                </button>

                {/* Current Location Button */}
                <button
                    onClick={handleGoToCurrentLocation}
                    className="bg-white cursor-pointer hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-md transition-colors duration-200"
                    title="ไปยังตำแหน่งปัจจุบัน"
                >
                    <Navigation className="w-5 h-5 text-blue-600" />
                </button>

                {/* Fit View Button */}
                <button
                    onClick={handleFitView}
                    className="bg-white cursor-pointer hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-md transition-colors duration-200"
                    title="ปรับมุมมอง"
                >
                    <MapPin className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            {/* Zoom Level Display (เพิ่มเติม) */}
            {/* <div className="absolute bottom-4 right-4 z-[1000] bg-white border border-gray-300 rounded-md px-3 py-1 shadow-md">
                <span className="text-sm text-gray-700">Zoom: {currentZoom}</span>
            </div> */}
        </div>
    );
}