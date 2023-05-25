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
    const result = data.result[0].body

    let currentList = null // To hold the current ul/li we're appending to

    result.forEach((block) => {
      let contentElement

      switch (block._type) {
        case 'block':
          if (block.listItem) {
            const listItemElement = document.createElement('li')
            listItemElement.textContent = block.children[0].text

            // If we already have a list we're adding to, append the new item.
            // Otherwise, create a new list.
            if (currentList) {
              currentList.appendChild(listItemElement)
            } else {
              currentList = document.createElement('ol')
              currentList.appendChild(listItemElement)
            }
          } else {
            // If we reach a non-list block and there's a list in progress, add it to the document and clear our currentList
            if (currentList) {
              document
                .querySelector('.container.articles')
                .appendChild(currentList)
              currentList = null // Reset the list
            }

            // Depending on the style, create different types of elements
            if (block.style.startsWith('h')) {
              contentElement = document.createElement(block.style)
            } else {
              contentElement = document.createElement('p')
            }

            contentElement.textContent = block.children[0].text
            contentElement.classList.add('article-content')
            document
              .querySelector('.container.articles')
              .appendChild(contentElement)
          }
          break

        // ... handle other types of blocks as needed ...

        default:
          // Skip blocks with types we're not handling
          break
      }
    })

    // After the loop, if there's still a list in progress, add it to the document
    if (currentList) {
      document.querySelector('.container.articles').appendChild(currentList)
    }
  })
  .catch((error) => console.error('Error:', error))
