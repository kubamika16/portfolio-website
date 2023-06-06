// Imported functions
import { fetchData, PROJECT_URL, formatSanityBody } from '../../functions.js'

// Fetching actual data from Sanity.io
fetchData(PROJECT_URL)
  .then((data) => {
    const body = data.result[0].body
    console.log(body)

    let formattedText = formatSanityBody(body)
    document.querySelector('.article-content').innerHTML = formattedText
  })
  .catch((error) => console.error('Error:', error))
