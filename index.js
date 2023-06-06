import {
  fetchData,
  sanityImageUrl,
  PROJECT_ID,
  DATASET,
  // dateFormatter,
  ISODateDescructureFunction,
} from './functions.js'

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

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//ARTICLES SECTION
const articleQuery = encodeURIComponent('*[_type == "post"]')
const articleUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${articleQuery}`
fetchData(articleUrl)
  .then((data) =>
    data.result.forEach((post) => {
      // Creating a string with a published date
      // Array destructuring is used to assign the parts of the date string to variables. The rest operator (...) is used to ignore the first element of the array (the day of the week).
      const [, month, day, year] = new Date(post.publishedAt)
        .toDateString()
        .split(' ')
      const dateString = `${month} ${day}, ${year}`

      // Create new div for each post
      let articleDiv = document.createElement('div')
      articleDiv.classList.add('single-item', 'single-article')

      // HTML STRUCTURE FOR ARTICLES
      articleDiv.innerHTML = `
       <div class="single-article-logo">
         <img src="${sanityImageUrl(
           PROJECT_ID,
           DATASET,
           post.mainImage.asset._ref,
         )}" alt="project-logo" />
       </div>
       <div class="single-article-right">
         <p class="date-item single-article-date">${dateString}</p>
         <a href="/articles/${post.folder}/index.html" class="post-title">
           <h3>${post.title}</h3>
         </a>
       </div>
     `

      // Append the new article div to the all-articles div
      document.querySelector('.all-articles').appendChild(articleDiv)
    }),
  )
  .catch((error) => console.error('Error', error))

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//PROJECTS SECTION
const projectQuery = encodeURIComponent('*[_type == "project"]')
const projectUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${projectQuery}`

fetchData(projectUrl)
  .then((data) => {
    data.result.forEach((project) => {
      console.log(project)

      const date = ISODateDescructureFunction(project.createdAt)
      console.log(date)

      // Create new div for each project
      let projectDiv = document.createElement('div')
      projectDiv.classList.add('project')

      // HTML structure for single project
      projectDiv.innerHTML = ` <div class="date-item single-project-date">${date.month}, ${date.year}</div>
      <a class="project-title" href="">${project.projectTitle}</a>
      <p class="project-description">
        ${project.description[0].children[0].text}
      </p>
      <div class="buttons">
      <button class="project-button">
        <a href="/it-journal/${project.projectFolder}/index.html">Journal</a>
      </button>
      <button class="project-button">
        <a href="${project.demoLink}">Demo</a>
      </button>
      <button class="project-button">
        <a href="${project.githubLink}"><span>Source</span></a>
        <img src="/assets/imgs/github-white.png" alt="" />
      </button>
    </div>`

      document.querySelector('.all-projects').appendChild(projectDiv)
    })
  })
  .catch((err) => console.log(err))
