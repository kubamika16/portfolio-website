import {
  fetchData,
  sanityImageUrl,
  PROJECT_ID,
  DATASET,
  // dateFormatter,
  ISODateDescructureFunction,
} from '../functions.js'

const projectQuery = encodeURIComponent('*[_type == "project"]')
const projectUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${projectQuery}`

// Function that checks if there is journal folder connected with certain project.
// Some projects don't have their journals. In that case button 'Journal' cannot be displayed
const journalExistence = (sanityFolderName) =>
  sanityFolderName
    ? `<button class="project-button"><a href="/it-journal/${sanityFolderName}/index.html">Journal</a></button>`
    : ''

// Some projects may not have a demo due to their prototype stage.
// Hence, we provide two options:
// 1. If a demo is available, a button to access the demo is shown.
// 2. If no demo is available, a button to send an email to request a demo is shown.
const demoExistance = (sanityDemo) =>
  sanityDemo
    ? `<button class="project-button">
        <a href="${sanityDemo}">Demo</a>
      </button>`
    : `<button class="project-button">
        <a href="mailto:kuba.mika16@gmail.com?subject=Project Demo Request">Demo</a>
      </button>`

fetchData(projectUrl)
  .then((data) => {
    data.result.forEach((project) => {
      console.log(project)

      const date = ISODateDescructureFunction(project.createdAt)
      console.log(date)

      console.log('Project folder', project.projectFolder)

      // Create new div for each project
      let projectDiv = document.createElement('div')
      projectDiv.classList.add('project')

      // HTML structure for single project
      projectDiv.innerHTML = ` <div class="date-item single-project-date">${
        date.month
      }, ${date.year}</div>
      <a class="project-title" href="">${project.projectTitle}</a>
      <p class="project-description">
        ${project.description[0].children[0].text}
      </p>
      <div class="buttons">
     ${journalExistence(project.projectFolder)}
      ${demoExistance(project.demoLink)}
      <button class="project-button">
        <a href="${project.githubLink}"><span>Source</span></a>
        <img src="/assets/imgs/github-white.png" alt="" />
      </button>
    </div>`

      document.querySelector('.all-projects').appendChild(projectDiv)
    })
  })
  .catch((err) => console.log(err))
