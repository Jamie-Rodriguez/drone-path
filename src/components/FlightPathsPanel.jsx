import { useContext, useState } from 'react'
import { RiSave3Fill } from 'react-icons/ri'
import { FaCog } from 'react-icons/fa'
import { IoTrashSharp } from 'react-icons/io5'
import { FlightPathsContext, SelectedPathContext } from '../App'

const FlightPathsPanel = ({ saveWaypointsToFlightPath }) => {
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

    setFlightPaths([ ...flightPaths, { name: newPathName, path: [] } ])
    // React batches these state updates together!
    // We can't just do:
    //     switchSelectedPath(flightPaths[flightPaths.length - 1])
    // When calling switchSelectedPath(), because of React's batching
    // 'flightPaths' won't be up to date with the new path added at this point
    // So this is kind of a hack; we know we are only adding one new path ahead
    // of time and we know where it will be (the end of the list)
    // Alternatives are forcing a re-render after call to setFlightPaths()
    // using flushSync(), but is heavy-handed compared to just doing this lol
    switchSelectedPath(flightPaths.length)
  }

  const handleKeyDownAndBlur = event => {
    if (event.key === 'Enter' || event.type === 'blur') {
      setEditing(undefined)

      if (names.includes(event.target.value)) {
        return
      }

      setFlightPaths(flightPaths.map((p, i) =>
        i === editing ? { name: event.target.value, path: p.path } : p
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
                                               style={{ marginRight: '1rem' }} /> : null }
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
