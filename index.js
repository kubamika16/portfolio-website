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

let PROJECT_ID = 'x18ixioq'
let DATASET = 'production'
let QUERY = encodeURIComponent('*[_type == "post"]')

let PROJECT_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

const fetchData = async function (url) {
  try {
    let response = await fetch(url)
    let data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

fetchData(PROJECT_URL)
  .then((data) =>
    data.result.forEach((post) => {
      console.log(post)

      // Create new div for each post
      let postDiv = document.createElement('div')
      postDiv.classList.add('single-item', 'single-article')

      function sanityImageUrl(imageId) {
        // Extract actual ID and the image format from the _id
        const parts = imageId.split('-')

        const actualId = parts[1]
        const dimensions = parts[2]
        const format = parts[parts.length - 1]

        return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${actualId}-${dimensions}.${format}`
      }

      console.log(sanityImageUrl(post.mainImage.asset._ref))

      // Add inner HTML structure
      postDiv.innerHTML = `
       <div class="single-article-logo">
         <img src="${sanityImageUrl(
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
