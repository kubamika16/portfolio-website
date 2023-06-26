import {
  fetchData,
  sanityImageUrl,
  PROJECT_ID,
  DATASET,
  ISODateDescructureFunction,
  formatSanityBody,
} from '../../functions.js'

// Define the GROQ query to retrieve all documents of type 'itJournal' from Sanity.io
const journalQuery = encodeURIComponent(`*[_type == "itJournal"]`)

// Specify the name of the project folder we are interested in
const folderName = 'my-website'

// Construct the URL for Sanity's Data API endpoint
const projectUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${journalQuery}`

const allJournals = document.querySelector('.all-journals')

// Fetch the data from Sanity.io
fetchData(projectUrl)
  .then((data) => {
    // The data from Sanity is now available and stored in itJournalData
    // const itJournalData = data.result
    // The optional chaining will return undefined if the property doesn't exist, and the nullish coalescing will provide a default value ([] in this case) if the left side is undefined or null.
    const itJournalData = data?.result ?? []
    console.log(itJournalData)

    // I want to filter notes that were created only for specific project. There might be a day when I edit 2 projects. On certain webpage I want only notes for certain project. Otherways there would be multiple notes from multiple projects
    // Process the returned data:
    // 1. For each journal entry, filter its tasks based on the specified project folder name
    // 2. If there are any tasks for the specific project, create a new object containing the journal date and these tasks
    // 3. Remove any undefined items from the array (these represent journal entries without tasks for the specific project)
    const filteredData = itJournalData
      .map((journal) => {
        console.log(journal)

        const filteredTasks =
          journal?.tasks?.filter(
            (task) => task.projectFolderName === folderName,
          ) ?? []

        if (filteredTasks.length !== 0)
          return { journalDate: journal.journalDate, tasks: filteredTasks }
      })
      // That filter deletes undefined values from an array
      .filter(Boolean)
    console.log('Filtered Data', filteredData)

    // Algorithm that helps to sort filtered journals from the newest to the oldest
    filteredData.sort(
      (a, b) => new Date(b.journalDate) - new Date(a.journalDate),
    )

    // Time for implementing that Sanity.io fetch data inside my website
    filteredData.forEach((dateItem) => {
      const tasksHTML = dateItem.tasks
        .map((task) => {
          const notesHTML = formatSanityBody(task.notes)
          let tileID = task.title
            .toLowerCase()
            .split(' ')
            .join('-')
            .replace(/[^a-z0-9-]/gi, '')
          console.log(tileID)
          return `
              <div class="journal-content">
                <div class="journal-tile">
                  <div class="tile-section title" id="${tileID}">
                    <h3><strong>${task.title}</strong></h3>
                  </div>
                  <div class="tile-section introduction">
                    <h3>Introduction 🌟</h3>
                    <p class="introduction-content">${task.introduction}</p>
                  </div>
                  <div class="tile-section notes">
                    <h3>Notes 📝</h3>
                    <p class="notes-content">${notesHTML}</p>
                  </div>
                </div>
              </div>
            `
        })
        .join('')

      const journalDiv = `
      <div class="journal-wrapper">
      <div class="journal single-journal fading-text">
          <div class="journal-info single-journal-info">
              <a class="journal-title single-journal-title" href="">
                  <h1>${dateItem.journalDate}</h1>
              </a>
          </div>
          ${tasksHTML}
      </div>
      <button class="show-more">Show more</button>
  </div>
  `

      allJournals.innerHTML += journalDiv
    })

    // Get all 'show more' buttons
    const showMoreButtons = document.querySelectorAll('.show-more')

    // Attach click event to each 'show more' button
    showMoreButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        // Accessing sibling element to our button (journal tile)
        const journal = event.target.previousElementSibling
        console.log(journal)

        journal.style.maxHeight = 'none'
        event.target.style.display = 'none'
        journal.classList.remove('fading-text')
      })
    })

    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    // Part of the code that executes when a user on the main page clicked on one of the journal entry titles
    let fragment = window.location.hash.substring(1)

    function removeFadeAndScrollToFragment(fragment) {
      let element = document.getElementById(fragment)

      if (element) {
        let journalWrapper = element.closest('.journal-wrapper')

        if (journalWrapper) {
          let journal = journalWrapper.querySelector('.single-journal')
          let showMoreButton = journalWrapper.querySelector('.show-more')

          // Stop the fading effect and show the full journal
          journal.classList.remove('fading-text')
          journal.style.maxHeight = 'none'

          // Hide the 'show more' button as we're showing the full journal
          showMoreButton.style.display = 'none'

          // Scroll the page to the journal entry
          element.scrollIntoView()

          return true
        }
      }

      return false
    }

    // Continuously check if the element with the provided fragment exists, and perform operations on it if found
    let intervalId = setInterval(function () {
      if (removeFadeAndScrollToFragment(fragment)) {
        // Stop the interval after the element is found and operations performed
        clearInterval(intervalId)
      }
    }, 100)
  })
  .catch((err) => {
    // If anything goes wrong with fetching or processing the data, log the error
    console.error(err)
  })
