//src
import join from 'lodash/join'
import size from 'lodash/size'
import map from 'lodash/fp/map'
import mapKeys from 'lodash/mapKeys'
import fetch from 'node-fetch'

const distanceBaseUrl =
    'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial'
const directionBaseUrl =
    'https://maps.googleapis.com/maps/api/directions/json?units=imperial'

export function getDistanceMatrix(origins, destinations) {
    const originQuery = generateRequestParamsFromFilters(origins)
    const destinationQuery = generateRequestParamsFromFilters(destinations)
    const distanceMatrixUrl = `${distanceBaseUrl}&origins=${originQuery}&destinations=${destinationQuery}&key=${
        process.env.ETA_API_KEY
    }`

    // trigger async function
    //   // log response or catch error of fetch promise
    //   fetchAsync(distanceMatrixUrl)
    //       .then(data => console.log(data))
    //       .catch(reason => console.log(reason.message))
    return fetch(distanceMatrixUrl)
        .then(res => res.json())
        .then(result => transformData(result, origins, destinations))
}
export function getDirection(origin, destination, waypoints) {
    const originQuery = generateRequestParamsFromFilters([origin])
    const destinationQuery = generateRequestParamsFromFilters([destination])
    const waypointsQuery = generateRequestParamsFromFilters(waypoints)
    const directionUrl = `${directionBaseUrl}&origin=${originQuery}&destination=${destinationQuery}&waypoints=${waypointsQuery}&key=${
        process.env.ETA_API_KEY
    }`

    return fetch(directionUrl).then(res => res.json())
}
function generateRequestParamsFromFilters(locations) {
    if (locations.length === 1) {
        const { lat, lng } = locations[0]
        return encodeURIComponent(`${lat}, ${lng}`)
    }
    const locationArray = map(loc => `${loc.lat}, ${loc.lng}`)(locations)

    return `${encodeURIComponent(join(locationArray, '|'))}`
}


function transformData(result, origins, destinations) {
    const { rows } = result
    const originArray = map(loc => `${loc.lat}, ${loc.lng}`)(origins)
    const destinationArray = map(loc => `${loc.lat}, ${loc.lng}`)(destinations)
    const arrayToObject = (arr, keyField) =>
        Object.assign(
            {},
            ...arr.map((row, index) => ({ [destinationArray[index]]: row })),
        )
    return rows.map((row, index) => ({
        [originArray[index]]: arrayToObject(rows[index]['elements']),
    }))
}
