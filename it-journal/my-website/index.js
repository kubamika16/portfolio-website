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
    // Part of the code below works when user on the main page clicked on one of five journal entry titles

    // Get the fragment from the URL. This is the part of the URL that follows the '#'.
    // It can be used to reference an element in the page, and is often used for 'jumping' to that element on page load.
    let fragment = window.location.hash.substring(1) // remove the '#'

    // This function takes a fragment (a part of the URL that starts with '#'), and it removes the fading effect from the journal entry associated with that fragment,
    // then scrolls to the journal entry. The function returns true if it was able to find the journal entry and perform the operations, and false otherwise.
    function removeFadeAndScrollToFragment(fragment) {
      // Try to get the HTML element with the ID specified by the fragment.
      // If there's no such element, 'getElementById' will return null.
      let element = document.getElementById(fragment)

      // Check if the element exists. If it doesn't, this function cannot do anything, so it returns false.
      if (element) {
        // Try to find the closest ancestor of the element with the class 'journal-wrapper'.
        // This is the containing element that we're going to manipulate.
        let journalWrapper = element.closest('.journal-wrapper')

        // Check if we were able to find the 'journal-wrapper'.
        if (journalWrapper) {
          // Get the journal and 'show more' button elements, which are the children of the journalWrapper.
          let journal = journalWrapper.querySelector('.single-journal')
          let showMoreButton = journalWrapper.querySelector('.show-more')

          // Remove the 'fading-text' class from the journal. This will stop the fading effect.
          journal.classList.remove('fading-text')

          // Set the max-height of the journal to 'none'. This will make the journal show in full, even if it's larger than the original 70vh.
          journal.style.maxHeight = 'none'

          // Hide the 'show more' button. We don't need it anymore because we're showing the full journal.
          showMoreButton.style.display = 'none'

          // Scroll the page to the journal entry. This will make the journal entry be at the top of the viewport, if possible.
          element.scrollIntoView()

          // Return true, because we were able to find the element and perform all operations successfully.
          return true
        }
      }

      // If we got here, it means we couldn't find either the element or the 'journal-wrapper'. In this case, we return false to indicate that the function couldn't perform its job.
      return false
    }

    // This line starts an interval that will run the provided function every 100ms.
    // The function will check if the element with the provided fragment exists, and if so, it will stop the interval and perform some operations on the element.
    let intervalId = setInterval(function () {
      // Check if the element exists and the operations were performed successfully.
      if (removeFadeAndScrollToFragment(fragment)) {
        // If so, stop the interval. We don't need to keep checking for the element, because we've found it and done everything we needed to do.
        clearInterval(intervalId)
      }
      // If not, the interval will automatically run the function again after 100ms.
    }, 100)
  })
  .catch((err) => {
    // If anything goes wrong with fetching or processing the data, log the error
    console.error(err)
  })
