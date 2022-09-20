import { useMapEvents } from 'react-leaflet'

const AttachCallbacksToMapEvents = ({ onClick, moveEnd, zoomEnd }) => {
  useMapEvents({
    click: event => {
      onClick(event)
    },
    moveend: event => {
      moveEnd(event.target.getCenter())
    },
    zoomend: event => {
      zoomEnd(event.target.getZoom())
    },
  })

  return null
}

export default AttachCallbacksToMapEvents
