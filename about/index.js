import { fetchData, PROJECT_ID, DATASET } from '../functions.js'

// Sanity.io
let QUERY = encodeURIComponent('*[_type == "author"]')
let PROJECT_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

fetchData(PROJECT_URL)
  .then((data) => {
    console.log(data.result[0])
  })
  .catch((err) => console.error(err))
