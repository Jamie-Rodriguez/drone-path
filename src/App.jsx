import { createContext, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import { IoTrashSharp } from 'react-icons/io5'
// Import Leaflet's stylesheet
// Throws warning:
//   autoprefixer: Replace color-adjust to print-color-adjust. The color-adjust shorthand is currently deprecated.
import 'leaflet/dist/leaflet.css'
// This library is required because the Leaflet library does NOT work with
// Webpack out of the box! Importing the local stylesheet (above) does NOT
// import the marker icons...
// See https://github.com/Leaflet/Leaflet/issues/4968
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet-defaulticon-compatibility'
import FlightPathsPanel from './FlightPathsPanel'
import AttachCallbackToMapClick from './AddMarkerOnClick'

const initialFlightPaths = []
export const FlightPathsContext = createContext(initialFlightPaths)

const initialSelectedPath = undefined
export const SelectedPathContext = createContext(initialSelectedPath)

export const App = () => {
  const [ flightPaths, setFlightPaths ] = useState(initialFlightPaths)
  const [ selectedPath, setSelectedPath ] = useState(initialSelectedPath)
  const [ waypoints, setWaypoints ] = useState([])
  const center = {
    lat: 43.31,
    lng: -1.98,
  }

  const addWaypoint = event => {
    if (selectedPath === undefined) {
      alert('No valid flight path selected!')
      return
    }

    setWaypoints([ ...waypoints, event.latlng ])
  }

  const deleteWaypoint = index => {
    setWaypoints(waypoints.filter((p, i) => i !== index))
  }

  const switchSelectedPath = newIndex => {
    if (selectedPath !== undefined) {
      setFlightPaths(flightPaths.map(
        (fp, i) => i === selectedPath ? { name: fp.name, path: waypoints } : fp)
      )
    }

    setSelectedPath(newIndex)
    setWaypoints(flightPaths[newIndex].path)
  }

  const deleteFlightpath = index => {
    setFlightPaths(flightPaths.filter((p, i) => i !== index))
    // After deleting, deselect
    // Should we select the next available path instead?
    setWaypoints([])
    setSelectedPath(undefined)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
      <SelectedPathContext.Provider value={{ selectedPath, switchSelectedPath }}>
        <FlightPathsContext.Provider value={{ flightPaths, setFlightPaths, deleteFlightpath }}>
          <FlightPathsPanel />
        </FlightPathsContext.Provider>
      </SelectedPathContext.Provider>

      {/* The Map component must be supplied non-percentage height/width! */}
      <MapContainer center={center}
                    zoom={13}
                    scrollWheelZoom={false}
                    onClick={ event => console.log('clicked!', event) }
                    style={{ height: '40rem', width: '40rem' }}>
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        />
        <AttachCallbackToMapClick callback={addWaypoint} />
        {waypoints.map((p, i) => (
          <Marker key={i} position={p}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <button type='button' onClick={ () => deleteWaypoint(i) }>
                  <IoTrashSharp />
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        <Polyline positions={waypoints} pathOptions={{ color: 'red' }}/>
      </MapContainer>
    </div>
  )
}
