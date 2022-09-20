import { useContext, useEffect, useState } from 'react'
import { RiSave3Fill } from 'react-icons/ri'
import { FaCog } from 'react-icons/fa'
import { IoTrashSharp } from 'react-icons/io5'
import { FlightPathsContext, SelectedPathContext } from '../App'

const FlightPathsPanel = ({ center, zoom, saveWaypointsToFlightPath, currentFlightPathDirty }) => {
  const { flightPaths, setFlightPaths, deleteFlightpath } = useContext(FlightPathsContext)
  const { selectedPath, switchSelectedPath } = useContext(SelectedPathContext)
  // If we are currently editing a flight path name
  const [ editing, setEditing ] = useState(undefined)

  const names = flightPaths.map(p => p.name)

  const createNewFlightPath = () => {
    let newPathName = 'New Path'
    let count = 0

    while (names.includes(newPathName)) {
      count++
      newPathName = `New Path (${count})`
    }

    setFlightPaths([
      ...flightPaths,
      {
        name: newPathName,
        center,
        zoom,
        path: []
      }
    ])
  }

  // Once we've added/deleted a flight path, go to the last item
  useEffect(() => {
    switchSelectedPath(flightPaths.length - 1)
  }, [flightPaths.length])

  const handleKeyDownAndBlur = event => {
    if (event.key === 'Enter' || event.type === 'blur') {
      setEditing(undefined)

      if (names.includes(event.target.value)) {
        return
      }

      setFlightPaths(flightPaths.map((fp, i) =>
        i === editing ? { ...fp, name: event.target.value } : fp
      ))
    }
  }

  return (
    <div id='flight-paths-panel'>
      <div id='flight-paths-header'>
        <h1 style={{ display: 'inline' }}>Flight Paths</h1>
        <button type='button'
                onClick={ createNewFlightPath }
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
            {i === selectedPath ? <RiSave3Fill onClick={() => saveWaypointsToFlightPath() }
                                               style={{ marginRight: '1rem',
                                                        color: currentFlightPathDirty() ? 'red' : 'black' }} />
                                : null }
            <IoTrashSharp onClick={ () => deleteFlightpath(i) }
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
