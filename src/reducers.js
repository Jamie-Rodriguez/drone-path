const reducer = (state, action) => {
  switch (action.type) {
    case 'NEW_FLIGHT_PATH':
      let newPathName = 'New Path'
      let count = 0

      const names = state.flightPaths.map(p => p.name)

      while (names.includes(newPathName)) {
        count++
        newPathName = `New Path (${count})`
      }
      return {
        ...state,
        flightPaths: [
          ...state.flightPaths,
          {
            name: newPathName,
            center: action.center,
            zoom: action.zoom,
            path: []
          }
        ],
        selectedPath: state.flightPaths.length,
        waypoints: []
      }
    case 'RENAME_FLIGHT_PATH':
      return {
        ...state,
        flightPaths: state.flightPaths.map((fp, i) =>
          i === action.editing ? { ...fp, name: action.name } : fp)
      }
    case 'DELETE_FLIGHT_PATH':
      return {
        ...state,
        flightPaths: state.flightPaths.filter((p, i) => i !== action.index),
        selectedPath: undefined,
        waypoints: []
      }
    case 'SAVE_WAYPOINTS':
      if (state.selectedPath === undefined) {
        return state
      }

      return {
        ...state,
        flightPaths: state.flightPaths.map(
          (fp, i) => i === state.selectedPath ? {
            ...fp,
            center: action.center,
            zoom: action.zoom,
            path: state.waypoints
          } : fp)
      }
    case 'EDIT_WAYPOINT':
      return {
        ...state,
        waypoints: state.waypoints.map((p, i) => i === action.index ? action.position : p)
      }
    case 'ADD_WAYPOINT':
      if (state.selectedPath === undefined) {
        alert('No valid flight path selected!')
        return
      }

      return {
        ...state,
        waypoints: [ ...state.waypoints, action.latlng ]
      }
    case 'DELETE_WAYPOINT':
      return {
        ...state,
        waypoints: state.waypoints.filter((p, i) => i !== action.index)
      }
    case 'CHANGE_SELECTED_PATH':
      return {
        ...state,
        selectedPath: action.newIndex,
        waypoints: state.flightPaths[action.newIndex].path
      }
    default:
      return state
  }
}

export default reducer
