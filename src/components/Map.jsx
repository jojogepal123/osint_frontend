import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";

const customIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div class="marker-wrapper">
      <div class="marker-shadow"></div>
      <div class="marker-body">
        <div class="marker-inner"></div>
        <div class="marker-center"></div>
      </div>
    </div>
  `,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

const createPopupContent = (loc) => {
  return {
    __html: `
    <div class="map-popup">
      <div class="popup-header">
        <div class="popup-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="popup-icon">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <span class="popup-title">${loc.name || "Location"}</span>
      </div>
      ${loc.address ? `<div class="popup-address">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="popup-detail-icon">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>${loc.address}</span>
      </div>` : ""}
      ${loc.date ? `<div class="popup-date">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="popup-detail-icon">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>${loc.date}</span>
      </div>` : ""}
    </div>
    `
  };
};

const isFiniteNumber = (v) => Number.isFinite(v);

const Map = ({ data = [] }) => {
  const points = useMemo(() => {
    return (data || [])
      .map((d) => ({
        ...d,
        latitude: d?.latitude !== null ? Number(d?.latitude) : null,
        longitude: d?.longitude !== null ? Number(d?.longitude) : null,
      }))
      .filter(
        (d) =>
          d.latitude !== null &&
          d.longitude !== null &&
          isFiniteNumber(d.latitude) &&
          isFiniteNumber(d.longitude)
      );
  }, [data]);

  if (points.length === 0) return null;

  const center = [points[0].latitude, points[0].longitude];

  return (
    <>
      <style>{`
        .leaflet-container {
          font-family: inherit;
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          border: 1px solid #06b6d4 !important;
          border-radius: 12px !important;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.3), 0 10px 40px rgba(0, 0, 0, 0.5) !important;
          padding: 0 !important;
        }
        
        .leaflet-popup-content {
          margin: 0 !important;
        }
        
        .leaflet-popup-tip-container {
          display: none !important;
        }
        
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
          font-size: 16px !important;
          padding: 6px !important;
          top: 6px !important;
          right: 6px !important;
          width: 24px !important;
          height: 24px !important;
          border-radius: 6px !important;
          transition: all 0.2s ease !important;
        }
        .custom-marker {
          background: none !important;
          border: none !important;
        }
        
        .marker-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .marker-shadow {
          width: 12px;
          height: 6px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          margin-top: -2px;
          filter: blur(2px);
        }
        
        .marker-body {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .marker-inner {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #22d3ee 0%, #34d399 100%);
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .marker-center {
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: rotate(45deg) translate(-50%, -50%);
        }
        
        .map-popup {
          padding: 16px;
          background: transparent;
        }
        
        .popup-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(6, 182, 212, 0.2);
        }
        
        .popup-icon-wrapper {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .popup-icon {
          width: 16px;
          height: 16px;
          color: #06b6d4;
        }
        
        .popup-title {
          font-weight: 600;
          color: #f8fafc;
          font-size: 14px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .popup-address, .popup-date {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 6px;
        }
        
        .popup-address:last-of-type {
          margin-bottom: 0;
        }
        
        .popup-detail-icon {
          width: 14px;
          height: 14px;
          color: #64748b;
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .popup-address span, .popup-date span {
          color: #cbd5e1;
          font-size: 12px;
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.4;
        }
        
        .popup-date span {
          color: #94a3b8;
          font-size: 11px;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
          border-radius: 0.75rem !important;
          overflow: hidden;
        }
        
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
          color: #f1f5f9 !important;
          border: none !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
          transition: all 0.2s ease !important;
        }
        
        .leaflet-control-zoom-in:hover,
        .leaflet-control-zoom-out:hover {
          background: linear-gradient(135deg, #334155 0%, #1e293b 100%) !important;
          color: #06b6d4 !important;
        }
        
        .leaflet-control-zoom-in {
          border-radius: 0.75rem 0.75rem 0 0 !important;
        }
        
        .leaflet-control-zoom-out {
          border-radius: 0 0 0.75rem 0.75rem !important;
        }
        
        .leaflet-control-attribution {
          background: rgba(15, 23, 42, 0.8) !important;
          color: #64748b !important;
          font-size: 10px !important;
          padding: 2px 8px !important;
          border-radius: 0.5rem 0 0 0 !important;
        }
        
        .leaflet-control-attribution a {
          color: #06b6d4 !important;
        }
      `}</style>
      <MapContainer
        className="h-[300px] md:h-[500px] w-full rounded-xl"
        center={center}
        zoom={10}
        zoomControl={true}
        whenReady={(map) => {
          if (points.length > 0) {
            const bounds = L.latLngBounds(
              points.map((p) => [p.latitude, p.longitude])
            );
            if (bounds.isValid()) {
              map.target.fitBounds(bounds, { padding: [20, 20] });
            }
          }
        }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        />
        {points.map((loc, index) =>
          loc.latitude !== null && loc.longitude !== null ? (
            <Marker
              key={index}
              position={[loc.latitude, loc.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div dangerouslySetInnerHTML={createPopupContent(loc)} />
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </>
  );
};

export default Map;
