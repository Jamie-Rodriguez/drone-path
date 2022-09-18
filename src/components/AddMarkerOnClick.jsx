import { useMapEvents } from 'react-leaflet'

const AttachCallbackToMapClick = ({ callback }) => {
  useMapEvents({
    click: event => {
      callback(event)
    }
  })

  return null
}

export default AttachCallbackToMapClick
