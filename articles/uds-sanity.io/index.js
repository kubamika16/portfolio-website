// Imported functions
import {
  fetchData,
  formatSanityBody,
  PROJECT_ID,
  DATASET,
} from '../../functions.js'

const folderName = 'uds-sanity.io'

// Taking data from Sanity.io where article is equal to one that has folder named "ydkjy-get-started"
const QUERY = encodeURIComponent(
  `*[_type == "post" && folder == "${folderName}"]`,
)
// That wariable helps to fetch certain dana from Sanity.io
const PROJECT_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

// Fetching actual data from Sanity.io
fetchData(PROJECT_URL)
  .then((data) => {
    console.log(data)
    const body = data.result[0].body
    console.log(body)
    let formattedText = formatSanityBody(body)
    document.querySelector('.article-content').innerHTML = formattedText
  })
  .catch((error) => console.error('Error:', error))
