import { Marker, Popup } from 'react-leaflet'
import { IoTrashSharp } from 'react-icons/io5'

const DraggableMarker = ({ index, position, dispatch }) => (
  <Marker draggable={ true }
          eventHandlers={{
            dragend: event => dispatch({ type: 'EDIT_WAYPOINT',
                                         index,
                                         position: event.target.getLatLng() })
          }}
          position={ position }>
    <Popup>
      <div style={{ textAlign: 'center' }}>
        <button type='button'
                onClick={ () => dispatch({ type: 'DELETE_WAYPOINT', index }) } >
          <IoTrashSharp />
        </button>
      </div>
    </Popup>
  </Marker>
)

export default DraggableMarker
