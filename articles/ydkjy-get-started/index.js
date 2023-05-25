import { fetchData } from '../../functions.js'

let PROJECT_ID = 'x18ixioq'
let DATASET = 'production'
let folderName = 'ydkjy-get-started'

// Taking data from Sanity.io where article is equal to one that has folder named "ydkjy-get-started"
let QUERY = encodeURIComponent(
  `*[_type == "post" && folder == "${folderName}"]`,
)

let PROJECT_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

fetchData(PROJECT_URL)
  .then((data) => {
    const result = data.result[0].body
    console.log(result)

    // articleDiv.innerHTML = `${result.forEach((arg) => {
    //   arg.children[0].text)
    // })}`

    for (let el of result) {
      let articleDiv = document.createElement('div')
      articleDiv.classList.add('article-content')
      articleDiv.innerHTML = el.children[0].text
      document.querySelector('.container.articles').appendChild(articleDiv)
    }

    // articleDiv.innerHTML = `${result[0].children[0].text}`
  })
  .catch((error) => console.error('Error', error))
