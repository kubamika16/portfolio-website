// Imported functions
import { fetchData } from '../../functions.js'

// data with identifications to connect with Sanity.io
let PROJECT_ID = 'x18ixioq'
let DATASET = 'production'
let folderName = 'ydkjy-get-started'

// Taking data from Sanity.io where article is equal to one that has folder named "ydkjy-get-started"
let QUERY = encodeURIComponent(
  `*[_type == "post" && folder == "${folderName}"]`,
)

// That wariable helps to fetch certain dana from Sanity.io
let PROJECT_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

// Fetching actual data from Sanity.io
fetchData(PROJECT_URL)
  .then((data) => {
    const body = data.result[0].body
    console.log(body)

    function formatBody(body) {
      let formattedText = ''

      for (let block of body) {
        switch (block._type) {
          case 'block':
            if (block.style === 'h2') {
              formattedText += `<h2>${block.children[0].text}</h2>`
            } else if (block.style === 'normal') {
              if (block.listItem === 'number') {
                formattedText += `<li>${block.children[0].text}</li>`
              } else {
                formattedText += `<p>${block.children[0].text}</p>`
              }
            }
            break

          // handle other _type values here...
        }
      }

      return formattedText
    }

    let formattedText = formatBody(body) // assuming `body` is your data
    document.querySelector('.container.articles').innerHTML = formattedText
  })
  .catch((error) => console.error('Error:', error))
