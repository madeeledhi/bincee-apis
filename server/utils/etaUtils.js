//src
import join from 'lodash/join'

function getDistanceMatrix(origins, destination) {
    const filters = generateRequestParamsFromFilters(origins, destination)
    const baseUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&${filters}&key=${
        process.env.ETA_API_KEY
    }`

    fetch(baseUrl).then(result => {
        return result
    })
}

function generateRequestParamsFromFilters(originsArray, destinationsArray) {
    const origin = `${encodeURIComponent(join(originsArray, '|'))}`
    const destination = `${encodeURIComponent(join(destinationsArray, '|'))}`
    return `${origin}& ${destination}`
}
