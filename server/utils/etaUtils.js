//src
import join from 'lodash/join'
import size from 'lodash/size'
import map from 'lodash/fp/map'
const distanceBaseUrl =
    'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial'

function getDistanceMatrix(origins, destinations) {
    const originQuery = generateRequestParamsFromFilters(origins)
    const destinationQuery = generateRequestParamsFromFilters(destinations)
    const distanceMatrixUrl = `${baseUrl}&origins=${originQuery}&destinations=${destinationQuery}&key=${
        process.env.ETA_API_KEY
    }`

    fetch(baseUrl).then(result => {
        return result
    })
}

function generateRequestParamsFromFilters(locations) {
    if (size(locations) == 1) {
        const { lat, lng } = location[0]
        return encodeURIComponent(`${lat}, ${lng}`)
    }
    const locationArray = map(loc => `${loc.lat}, ${loc.lng}`)(locations)

    return `${encodeURIComponent(join(locationArray, '|'))}`
}
