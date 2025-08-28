import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useMemo } from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const isFiniteNumber = (v) => Number.isFinite(v);

const Map = ({ data = [] }) => {
  // normalize to numbers and drop invalid points
  const points = useMemo(() => {
    return (data || [])
      .map((d) => ({
        ...d,
        latitude: Number(d?.latitude),
        longitude: Number(d?.longitude),
      }))
      .filter((d) => isFiniteNumber(d.latitude) && isFiniteNumber(d.longitude));
  }, [data]);

  if (points.length === 0) return null;

  const center = [points[0].latitude, points[0].longitude];

  return (
    <MapContainer
      className="h-[300px] md:h-[500px] w-[100%]"
      center={center}
      zoom={10}
      // optional: prevent crashes if center somehow becomes invalid
      whenReady={(map) => {
        // If you want to fit bounds to all points:
        const bounds = L.latLngBounds(
          points.map((p) => [p.latitude, p.longitude])
        );
        map.target.fitBounds(bounds, { padding: [20, 20] });
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {points.map((loc, index) => (
        <Marker key={index} position={[loc.latitude, loc.longitude]}>
          <Popup>
            <div>
              <div className="text-md font-bold">{loc.name}</div>
              <div className="text-xs">{loc.address}</div>
              <div className="text-xs">{loc.date}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import 'leaflet/dist/leaflet.css';
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow
// });
// const Map = ({ data }) => {
//   if (!data || data.length === 0) {
//     return null;
//   }

//   return (
//     <>
//       <MapContainer className="h-[300px] md:h-[500px] w-[100%]" center={[data[0].latitude, data[0].longitude]} zoom={10} >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
//         {data.map((loc, index) => (
//           <Marker key={index} position={[loc.latitude, loc.longitude]}>
//             <Popup>
//               <div>
//                 <div className="text-md font-bold">{loc.name}</div>
//                 <div className="text-xs">{loc.address}</div>
//                 <div className="text-xs">{loc.date}</div>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </>
//   );
// };

// export default Map;
