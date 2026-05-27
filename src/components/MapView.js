import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function MapView({ listings }) {
  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "24px",
        overflow: "hidden",
        marginTop: "30px"
      }}
    >
      <MapContainer
        center={[-26.2041, 28.0473]}
        zoom={6}
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {listings.map((listing) => (
          <Marker
            key={listing._id}
            position={[
              listing.latitude || -26.2041,
              listing.longitude || 28.0473
            ]}
          >
            <Popup>
              <h3>{listing.title}</h3>
              <p>{listing.location}</p>
              <p>R{listing.price}/night</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;