import {
  fetchData,
  PROJECT_ID,
  DATASET,
  formatSanityBody,
} from '../functions.js'

// Sanity.io
let QUERY = encodeURIComponent('*[_type == "author"]')
let PROJECT_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

fetchData(PROJECT_URL)
  .then((data) => {
    const aboutMe = data.result[0].aboutMe

    let formattedText = formatSanityBody(aboutMe)
    document.querySelector('.about-me-content').innerHTML = formattedText
  })
  .catch((err) => console.error(err))
