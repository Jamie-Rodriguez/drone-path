import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const RecenterMap = ({ center, zoom }) => {
    const map = useMap()

    useEffect(() => {
        map.setView(center, zoom)
    }, [center, zoom])

    return null
}

export default RecenterMap
