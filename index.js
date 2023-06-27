import {
  fetchData,
  sanityImageUrl,
  PROJECT_ID,
  DATASET,
  // dateFormatter,
  ISODateDescructureFunction,
  dateFormatter,
} from './functions.js'

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

    // Get all tasks, adding the journal date to each task
    let allTasks = itJournalData.result.reduce((acc, entry) => {
      let tasksWithDate = entry.tasks.map((task) => ({
        ...task,
        journalDate: entry.journalDate,
      }))
      return [...acc, ...tasksWithDate]
    }, [])

    // Sort tasks by date and get the first 5
    allTasks.sort((a, b) => new Date(b.journalDate) - new Date(a.journalDate))
    const firstFiveTasks = allTasks.slice(0, 5)
    console.log(firstFiveTasks)

    // Create a document fragment
    let fragment = document.createDocumentFragment()

    // Implementing these 5 tasks in my main page.
    firstFiveTasks.forEach((task) => {
      // Create new div for each journal entry
      let entryDiv = document.createElement('a')
      let tileID = task.title
        .toLowerCase()
        .split(' ')
        .join('-')
        .replace(/[^a-z0-9-]/gi, '')
      console.log(task.projectFolderName)
      entryDiv.href = `/it-journal/${task.projectFolderName}/index.html#${tileID}`

      entryDiv.classList.add('single-item', 'single-post')
      // HTML STRUCTURE FOR JOURNAL ENTRIES
      entryDiv.innerHTML = `
         <div class="post-title">
           <h3> ${task.title}</h3>
         </div>
         <div class="post-info">
           <p class="date-item latest-journal-date">
             ${dateFormatter(task.journalDate)}
           </p>
         </div>`

      // Append the new article div to the fragment
      fragment.appendChild(entryDiv)
    })

    // Append the fragment to the posts
    document.querySelector('.posts').appendChild(fragment)

    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //ARTICLES SECTION
    articleData.result.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
    )
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

      let projectJournalButton = ''
      if (project.projectFolder) {
        projectJournalButton = `<button class="project-button">
        <a href="/it-journal/${project.projectFolder}/index.html">Journal</a>
      </button>`
      }

      projectDiv.innerHTML = `
      <div class="project-data">
          <div class="date-item single-project-date">
            ${date.month}, ${date.year}
          </div>
          <a class="project-title" href="">${project.projectTitle}</a>
          <p class="project-description">
            ${project.description[0].children[0].text}
          </p>
        </div>
        <div class="buttons">
          ${projectJournalButton}
          <button class="project-button">
            <a href="${project.demoLink}">Demo</a>
          </button>
          <button class="project-button">
            <a href="${project.githubLink}"><span>Source</span></a>
            <img src="/assets/imgs/github-white.png" alt="" />
          </button>
        </div>
    `

      document.querySelector('.all-projects').appendChild(projectDiv)
    })
  })
  .catch((error) => {
    console.log(error)
  })
