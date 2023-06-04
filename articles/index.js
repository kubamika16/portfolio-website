import { fetchData } from '../functions.js'

const PROJECT_ID = 'x18ixioq'
const DATASET = 'production'
let QUERY = encodeURIComponent('*[_type == "post"]')

let PROJECT_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

fetchData(PROJECT_URL)
  .then((data) => {
    const body = data.result
    console.log(body)
  })
  .catch((error) => console.error('Error:', error))

const allArticles = document.querySelector('.year-section')
console.log(allArticles)

const newOne = `<div class="article">
<a
  class="article-name"
  href="/articles/uds-sanity.io/index.html"
>
  Understanding Sanity.io
</a>
<p class="article-date">
  <time datetime="2023-05-05">May 5</time>
</p>
</div>`

allArticles.innerHTML += newOne
