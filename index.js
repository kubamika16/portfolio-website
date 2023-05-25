import { fetchData, sanityImageUrl } from './functions.js'

document.getElementById('closeButton').addEventListener('click', function () {
  document.querySelector('.overlay').style.display = 'none'
  localStorage.setItem('overlayHiddenAt', Date.now())
})

// Check if the overlay should be displayed
const overlayHiddenAt = localStorage.getItem('overlayHiddenAt')
const timeElapsed = Date.now() - (overlayHiddenAt || 0)

const fiveMinutesInMilliseconds = 5 * 60 * 10000

if (timeElapsed < fiveMinutesInMilliseconds) {
  document.querySelector('.overlay').style.display = 'none'
} else {
  document.querySelector('.overlay').style.display = 'flex'
}

const PROJECT_ID = 'x18ixioq'
const DATASET = 'production'
let QUERY = encodeURIComponent('*[_type == "post"]')

let PROJECT_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

fetchData(PROJECT_URL)
  .then((data) =>
    data.result.forEach((post) => {
      console.log(post)

      // Create new div for each post
      let postDiv = document.createElement('div')
      postDiv.classList.add('single-item', 'single-article')

      // Add inner HTML structure
      postDiv.innerHTML = `
       <div class="single-article-logo">
         <img src="${sanityImageUrl(
           PROJECT_ID,
           DATASET,
           post.mainImage.asset._ref,
         )}" alt="project-logo" />
       </div>
       <div class="single-article-right">
         <p class="date-item single-article-date">${new Date(
           post.publishedAt,
         ).toDateString()}</p>
         <a href="/articles/${post.folder}/index.html" class="post-title">
           <h3>${post.title}</h3>
         </a>
       </div>
     `

      // Append the new post div to the all-articles div
      document.querySelector('.all-items.all-articles').appendChild(postDiv)
    }),
  )
  .catch((error) => console.error('Error', error))
