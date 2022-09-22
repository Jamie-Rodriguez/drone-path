import { useReducer, useState, useEffect } from 'react'
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
import reducer from './reducers'
import FlightPathsPanel from './components/FlightPathsPanel'
import Map from './components/Map'

const initialFlightPaths = JSON.parse(localStorage.getItem('drone-path-app-flight-paths')) || []

export const App = () => {
  const [state, dispatch] = useReducer(reducer, { flightPaths: initialFlightPaths,
                                                  waypoints: [],
                                                  selectedPath: undefined })
  // The state of the current center/zoom on the map
  const [ currentCenter, setCurrentCenter ] = useState({ lat: 43.31, lng: -1.98 })
  const [ currentZoom, setCurrentZoom ] = useState(13)
  // These are updated when we wish to pan the map to the new coordinates
  // i.e. when selecting a new flight path that is in a different place,
  // we should pan to it automatically - set these variables to the new values
  // to trigger the map
  const [ panToCenter, setPanToCenter ] = useState({ lat: 43.31, lng: -1.98 })
  const [ panToZoom, setPanToZoom ] = useState(13)

  useEffect(() => {
    localStorage.setItem('drone-path-app-flight-paths', JSON.stringify(state.flightPaths))
  }, [state.flightPaths])

  const currentFlightPathDirty = () => {
    const { flightPaths, waypoints, selectedPath } = state

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
    dispatch({ type: 'CHANGE_SELECTED_PATH', newIndex })
    setPanToCenter(state.flightPaths[newIndex].center)
    setPanToZoom(state.flightPaths[newIndex].zoom)
  }

  return (
    <div id='ui-container'>
      <FlightPathsPanel center={ currentCenter }
                        zoom={ currentZoom }
                        flightPaths={ state.flightPaths }
                        selectedPath={ state.selectedPath }
                        dispatch={ dispatch }
                        currentFlightPathDirty={ currentFlightPathDirty }
                        switchSelectedPath={ switchSelectedPath } />

      <Map panToCenter={ panToCenter }
           panToZoom={ panToZoom }
           waypoints={ state.waypoints }
           dispatch= { dispatch }
           moveEnd={ setCurrentCenter }
           zoomEnd={ setCurrentZoom } />
    </div>
  )
}
