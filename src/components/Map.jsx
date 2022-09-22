import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import RecenterMap from './RecenterMap'
import AttachCallbacksToMapEvents from './AttachCallbacksToMapEvents'
import DraggableMarker from './DraggableMarker'

// This component has no mutable state; it's completely dependant on it's props
// Could just put in App.jsx but the file was starting to get a bit crowded and
// this is a logical separation of concerns
const Map = ({ panToCenter, panToZoom, waypoints, setWaypoints, addWaypoint, deleteWaypoint, moveEnd, zoomEnd }) => (
  <MapContainer center={{ lat: 43.31, lng: -1.98, }}
                zoom={ 13 }
                scrollWheelZoom={ false }
                style={{ height: '40rem', width: '40rem' }}>
  {/* The MapContainer component must be supplied non-percentage height/width! */}
    <TileLayer
      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    />
    <RecenterMap center={ panToCenter } zoom={ panToZoom }/>
    <AttachCallbacksToMapEvents onClick={ addWaypoint }
                                moveEnd={ moveEnd }
                                zoomEnd={ zoomEnd } />
    {waypoints.map((p, i) => (
      <DraggableMarker key={ i }
                       index={ i }
                       position={ p }
                       waypoints={ waypoints }
                       setWaypoints={ setWaypoints }
                       deleteWaypoint={ deleteWaypoint } />
    ))}
    <Polyline positions={ waypoints } pathOptions={{ color: 'red' }}/>
  </MapContainer>
)

export default Map
