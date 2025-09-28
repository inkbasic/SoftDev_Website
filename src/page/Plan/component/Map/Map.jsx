import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { Plus, Minus, MapPin, Navigation } from 'lucide-react';
import { getTravelBetween } from '@/lib/routeService.jsx';

// แก้ไข default icon ของ Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// เปลี่ยนชื่อคอมโพเนนต์เป็น MapView และรับ markers ด้วย
export default function MapView({ center = [13.7563, 100.5018], markers = [] }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const currentLocationMarkerRef = useRef(null);
    const markersLayerRef = useRef(null);
    const routesLayerRef = useRef(null); // NEW: layer สำหรับเส้นทาง
    const [currentZoom, setCurrentZoom] = useState(13);

    useEffect(() => {
        if (!mapRef.current) return;

        mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: false
        }).setView(center, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);

        markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
        routesLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current); // NEW

        mapInstanceRef.current.on('zoomend', () => {
            setCurrentZoom(mapInstanceRef.current.getZoom());
        });

        return () => {
            mapInstanceRef.current?.remove();
        };
    }, []);

    // วาง/อัปเดตหมุดจาก props.markers
    useEffect(() => {
        if (!mapInstanceRef.current || !markersLayerRef.current) return;

        markersLayerRef.current.clearLayers();
        if (!markers || markers.length === 0) return;

        const latlngs = [];
        markers.forEach(m => {
            const [lat, lng] = m.position;
            const ll = L.latLng(lat, lng);
            latlngs.push(ll);

            // หมุดวงกลมมีเลข order
            const icon = L.divIcon({
                className: "order-marker",
                html: `<div class="order-pin">${m.order ?? ""}</div>`,
                iconSize: [32, 38],        // รวมส่วนหาง
                iconAnchor: [16, 34],      // จุดอ้างอิงปลายหาง
                popupAnchor: [0, -30]
            });

            const marker = L.marker(ll, {
                icon,
                zIndexOffset: 1000 - (Number(m.order) || 0)
            })
                .addTo(markersLayerRef.current)
                // .bindPopup(m.name || "สถานที่");

            // แสดงชื่อค้างไว้
            marker.bindTooltip(m.name || "สถานที่", {
                permanent: true,
                direction: "top",
                offset: [0, -40],
                opacity: 1,
                className: "place-label"
            }).openTooltip();
        });

        if (latlngs.length === 1) {
            mapInstanceRef.current.setView(latlngs[0], Math.max(mapInstanceRef.current.getZoom(), 14));
        } else {
            const bounds = L.latLngBounds(latlngs);
            mapInstanceRef.current.fitBounds(bounds, { padding: [24, 24] });
        }
    }, [markers]);

    useEffect(() => {
        if (!mapInstanceRef.current || !routesLayerRef.current) return;

        const abort = new AbortController();
        routesLayerRef.current.clearLayers();

        // ต้องมีอย่างน้อย 2 จุดถึงจะคำนวณเส้นทางได้
        if (!markers || markers.length < 2) return;

        // คิวรีทีละช่วง (ป้องกันโดน rate-limit)
        const run = async () => {
            for (let i = 0; i < markers.length - 1; i++) {
                const a = { source: markers[i].position };
                const b = { source: markers[i + 1].position };
                const route = await getTravelBetween(a, b, abort.signal);
                if (route?.coords?.length) {
                    L.polyline(route.coords, {
                        color: '#2563eb',
                        weight: 8,
                        opacity: 0.8
                    }).addTo(routesLayerRef.current);
                }
            }
        };

        run().catch(() => { /* ignore */ });
        return () => abort.abort();
    }, [markers]);

    // อัปเดตตำแหน่งปัจจุบันเมื่อ center เปลี่ยน
    useEffect(() => {
        if (!mapInstanceRef.current || !center) return;

        if (currentLocationMarkerRef.current) {
            mapInstanceRef.current.removeLayer(currentLocationMarkerRef.current);
        }

        const currentLocationIcon = L.divIcon({
            className: 'current-location-marker',
            html: `<div class="current-location-dot"><div class="current-location-pulse"></div></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        currentLocationMarkerRef.current = L.marker(center, { icon: currentLocationIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('ตำแหน่งปัจจุบันของคุณ');
    }, [center]);

    const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
    const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
    const handleGoToCurrentLocation = () => mapInstanceRef.current?.setView(center, 15);
    const handleFitView = () => {
        if (!mapInstanceRef.current) return;
        const layers = markersLayerRef.current?.getLayers?.() || [];
        if (layers.length) {
            const group = L.featureGroup(layers);
            mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [24, 24] });
        } else if (center) {
            mapInstanceRef.current.setView(center, 13);
        }
    };

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full" />
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <button onClick={handleZoomIn} className="bg-white cursor-pointer hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-md" title="ขยายแผนที่">
                    <Plus className="w-5 h-5 text-gray-700" />
                </button>
                <button onClick={handleZoomOut} className="bg-white cursor-pointer hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-md" title="ย่อแผนที่">
                    <Minus className="w-5 h-5 text-gray-700" />
                </button>
                <button onClick={handleGoToCurrentLocation} className="bg-white cursor-pointer hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-md" title="ไปยังตำแหน่งปัจจุบัน">
                    <Navigation className="w-5 h-5 text-blue-600" />
                </button>
                <button onClick={handleFitView} className="bg-white cursor-pointer hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-md" title="ปรับมุมมอง">
                    <MapPin className="w-5 h-5 text-gray-700" />
                </button>
            </div>
        </div>
    );
}