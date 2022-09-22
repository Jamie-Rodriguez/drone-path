import { Marker, Popup } from 'react-leaflet'
import { IoTrashSharp } from 'react-icons/io5'

const DraggableMarker = ({ index, position, waypoints, setWaypoints, deleteWaypoint }) => (
  <Marker draggable={true}
          eventHandlers={{
            dragend: event => setWaypoints(
              waypoints.map((wp, i) => i === index ? event.target.getLatLng() : wp)
            )
          }}
          position={position}>
    <Popup>
      <div style={{ textAlign: 'center' }}>
        <button type='button' onClick={ () => deleteWaypoint(index) }>
          <IoTrashSharp />
        </button>
      </div>
    </Popup>
  </Marker>
)

export default DraggableMarker
