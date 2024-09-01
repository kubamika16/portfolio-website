import {
  fetchData,
  PROJECT_ID,
  DATASET,
  ISODateDescructureFunction,
} from '../functions.js'

// Sanity.io
let QUERY = encodeURIComponent('*[_type == "post"]')
let PROJECT_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

const allArticles = document.querySelector('.year-section')

fetchData(PROJECT_URL)
  .then((data) => {
    const body = data.result
    body.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

    data.result.forEach((article) => {
      console.log(article)
      const articleTitle = article.title
      const articlePublishedDate = ISODateDescructureFunction(
        article.publishedAt,
      )
      // console.log(articlePublishedDate)

      const articleFolder = article.folder

      const articleDiv = `<div class="article">
      <a
        class="article-name"
        href="../articles/${articleFolder}/index.html"
      >
        ${articleTitle}
      </a>
      <p class="article-date">${articlePublishedDate.month} ${articlePublishedDate.day}</p>
      </div>`

      allArticles.innerHTML += articleDiv
    })
  })
  .catch((error) => console.error('Error:', error))
