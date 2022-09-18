import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import { IoTrashSharp } from 'react-icons/io5'
import AttachCallbackToMapClick from './AddMarkerOnClick'

// This component has no mutable state; it's completely dependant on it's props
// Could just put in App.jsx but the file was starting to get a bit crowded and
// this is a logical separation of concerns
const Map = ({ center, waypoints, addWaypoint, deleteWaypoint }) => (
  <MapContainer center={ center }
                zoom={ 13 }
                scrollWheelZoom={ false }
                style={{ height: '40rem', width: '40rem' }}>
  {/* The MapContainer component must be supplied non-percentage height/width! */}
    <TileLayer
      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    />
    <AttachCallbackToMapClick callback={ addWaypoint } />
    {waypoints.map((p, i) => (
      <Marker key={ i } position={ p }>
        <Popup>
          <div style={{ textAlign: 'center' }}>
            <button type='button' onClick={ () => deleteWaypoint(i) }>
              <IoTrashSharp />
            </button>
          </div>
        </Popup>
      </Marker>
    ))}
    <Polyline positions={ waypoints } pathOptions={{ color: 'red' }}/>
  </MapContainer>
)

export default Map
