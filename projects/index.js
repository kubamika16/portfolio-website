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
