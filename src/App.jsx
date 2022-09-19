import { createContext, useState, useEffect } from 'react'
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
import FlightPathsPanel from './components/FlightPathsPanel'
import Map from './components/Map'

const initialFlightPaths = JSON.parse(localStorage.getItem('drone-path-app-flight-paths')) || []
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

  useEffect(() => {
    localStorage.setItem('drone-path-app-flight-paths', JSON.stringify(flightPaths))
  }, [flightPaths])

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

  const saveWaypointsToFlightPath = () => {
    if (selectedPath !== undefined) {
      setFlightPaths(flightPaths.map(
        (fp, i) => i === selectedPath ? { name: fp.name, path: waypoints } : fp)
      )
    }
  }

  const currentFlightPathDirty = () => {
    if (waypoints.length !== flightPaths[selectedPath].path.length) {
      return true
    }

    for (let i = 0; i < waypoints.length; i++) {
      if (waypoints[i] !== flightPaths[selectedPath].path[i]) {
        return true
      }
    }

    return false
  }

  const switchSelectedPath = newIndex => {
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
    <div id='ui-container'>
      <SelectedPathContext.Provider value={{ selectedPath, switchSelectedPath }}>
        <FlightPathsContext.Provider value={{ flightPaths, setFlightPaths, deleteFlightpath }}>
          <FlightPathsPanel saveWaypointsToFlightPath={ saveWaypointsToFlightPath }
                            currentFlightPathDirty={ currentFlightPathDirty } />
        </FlightPathsContext.Provider>
      </SelectedPathContext.Provider>

      <Map center={ center }
           waypoints={ waypoints }
           addWaypoint={ addWaypoint }
           deleteWaypoint={ deleteWaypoint } />
    </div>
  )
}
