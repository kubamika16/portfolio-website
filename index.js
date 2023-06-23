import {
  fetchData,
  sanityImageUrl,
  PROJECT_ID,
  DATASET,
  // dateFormatter,
  ISODateDescructureFunction,
  dateFormatter,
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
//ARTICLES Query
const articleQuery = encodeURIComponent('*[_type == "post"]')
const articleUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${articleQuery}`

//////////////////////////////////////////////////////
//PROJECTS Query
const projectQuery = encodeURIComponent('*[_type == "project"]')
const projectUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${projectQuery}`

//////////////////////////////////////////////////////
//LATEST JOURNALS Query
const itJournalQuery = encodeURIComponent('*[_type == "itJournal"]')
const itJournaltUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${itJournalQuery}`

Promise.all([
  fetchData(articleUrl),
  fetchData(projectUrl),
  fetchData(itJournaltUrl),
])
  .then(([articleData, projectData, itJournalData]) => {
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //IT JOURNAL SECTION

    // First, I need to sort journals. They are retrieved from Sanity in unorganized way
    itJournalData.result.sort(
      (a, b) => new Date(b.journalDate) - new Date(a.journalDate),
    )
    // Then I have to store all tasks retrieved from Sanity. I need to do it because later i want to display only first 5 of them
    const allTasks = []
    itJournalData.result.forEach((entry, index) => {
      entry.tasks.forEach((task) => {
        // Adding journal date to the certain task object and putting that task in allTasks array
        task.journalDate = entry.journalDate
        allTasks.push(task)
      })
    })
    // Take the first 5 tasks
    const firstFiveTasks = allTasks.slice(0, 5)

    // Implementing these 5 tasks in my main page.
    firstFiveTasks.forEach((task) => {
      // Create new div for each journal entry
      let entryDiv = document.createElement('a')
      entryDiv.classList.add('single-item', 'single-post')
      // HTML STRUCTURE FOR JOURNAL ENTRIES
      entryDiv.innerHTML = `
         <div class="post-title">
           <h3>${task.title}</h3>
         </div>
         <div class="post-info">
           <p class="date-item latest-journal-date">
             ${dateFormatter(task.journalDate)}
           </p>
         </div>`

      // Append the new article div to the all-articles div
      document.querySelector('.posts').appendChild(entryDiv)
    })

    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //ARTICLES SECTION
    articleData.result.forEach((post) => {
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
         <p class="date-item single-article-date">${dateFormatter(
           post.publishedAt,
         )}</p>
         <a href="/articles/${post.folder}/index.html" class="post-title">
           <h3>${post.title}</h3>
         </a>
       </div>
     `

      // Append the new article div to the all-articles div
      document.querySelector('.all-articles').appendChild(articleDiv)
    })
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //PROJECTS SECTION
    projectData.result.forEach((project) => {
      // console.log(project)

      const date = ISODateDescructureFunction(project.createdAt)
      // console.log(date)

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
  .catch((error) => {
    console.log(error)
  })
