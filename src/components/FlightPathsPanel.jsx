import { useEffect, useState } from 'react'
import { RiSave3Fill } from 'react-icons/ri'
import { FaCog } from 'react-icons/fa'
import { IoTrashSharp } from 'react-icons/io5'

const FlightPathsPanel = ({ center,
                            zoom,
                            flightPaths,
                            selectedPath,
                            dispatch,
                            currentFlightPathDirty,
                            switchSelectedPath }) => {
  // If we are currently editing a flight path name
  const [ editing, setEditing ] = useState(undefined)

  // Once we've added/deleted a flight path, go to the last item
  useEffect(() => {
    switchSelectedPath(flightPaths.length - 1)
  }, [flightPaths.length])

  const handleKeyDownAndBlur = event => {
    if (event.key === 'Enter' || event.type === 'blur') {
      setEditing(undefined)

      const names = flightPaths.map(p => p.name)

      if (names.includes(event.target.value)) {
        return
      }

      dispatch({ type: 'RENAME_FLIGHT_PATH', editing, name: event.target.value })
    }
  }

  return (
    <div id='flight-paths-panel'>
      <div id='flight-paths-header'>
        <h1 style={{ display: 'inline' }}>Flight Paths</h1>
        <button type='button'
                onClick={ () => dispatch({ type: 'NEW_FLIGHT_PATH',
                                           center,
                                           zoom }) }
                style={{ marginLeft: '0.5rem' }}>+</button>
      </div>
      {flightPaths.map((p, i) =>
        <div key={ p.name } className='flight-path'>
          {i === editing ?
              <input type='text'
                     defaultValue={ p.name }
                     onKeyUp={ handleKeyDownAndBlur }
                     onBlur={ handleKeyDownAndBlur } />
            :
              <span onClick={ () => switchSelectedPath(i) }
                    className={ i === selectedPath ? 'selected' : null }>
                { p.name }
              </span>
          }
          <span>
            {i === selectedPath ? <RiSave3Fill onClick={() => dispatch({ type: 'SAVE_WAYPOINTS',
                                                                         center,
                                                                         zoom }) }
                                               style={{ marginRight: '1rem',
                                                        color: currentFlightPathDirty() ? 'red'
                                                                                        : 'black'
                                                       }} />
                                : null }
            <IoTrashSharp onClick={ () => dispatch({ type: 'DELETE_FLIGHT_PATH',
                                                     index: i }) }
                          style={{ marginRight: '1rem' }}/>
            <FaCog onClick={ () => setEditing(i) }
                   style={{ marginRight: '1rem' }}/>
          </span>
        </div>
      )}
    </div>
  )
}

export default FlightPathsPanel
