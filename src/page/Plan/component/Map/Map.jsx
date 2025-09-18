import React, { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, ScaleControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// src/page/Plan/component/Map.jsx
// ติดตั้งแพ็กเกจก่อนใช้งาน:
// npm i leaflet react-leaflet


// แก้ปัญหา marker icon ไม่แสดงในบางบันเดล (เช่น CRA, Vite)
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

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

export default function Map({
    center = [13.7563, 100.5018],
    zoom = 13,
    markers = [],
    fitToMarkers = true,
    tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution = '&copy; OpenStreetMap contributors',
    onMapClick,
    className,
    style,
    children,
}) {
    // ถ้าไม่มี center กำหนดจาก marker แรก
    const initialCenter = useMemo(() => {
        if (center && Array.isArray(center)) return center;
        if (markers?.[0]?.position) return markers[0].position;
        return [13.7563, 100.5018];
    }, [center, markers]);

    const containerStyle = useMemo(
        () => ({
            height: '100%',
            width: '100%',
            ...style,
        }),
        [style]
    );

    return (
        <MapContainer
            center={initialCenter}
            zoom={zoom}
            className={className}
            style={containerStyle}
            zoomControl={false}
            scrollWheelZoom
        >
            <TileLayer url={tileUrl} attribution={tileAttribution} />

            {fitToMarkers && <FitToMarkers markers={markers} />}
            {onMapClick && <MapClickHandler onClick={onMapClick} />}

            <ZoomControl position="topright" />
            <ScaleControl position="bottomleft" />

            {markers.map((m, i) => (
                <Marker
                    key={i}
                    position={m.position}
                    draggable={!!m.draggable}
                    icon={m.icon}
                    eventHandlers={m.eventHandlers}
                >
                    {m.popup ? <Popup>{m.popup}</Popup> : null}
                </Marker>
            ))}

            {children}
        </MapContainer>
    );
}