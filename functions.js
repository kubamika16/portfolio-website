// Fetching data
const fetchData = async function (url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

const sanityImageUrl = function (PROJECT_ID, DATASET, imageId) {
  // Extract actual ID and the image format from the _id
  const parts = imageId.split('-')

  const actualId = parts[1]
  const dimensions = parts[2]
  const format = parts[parts.length - 1]

  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${actualId}-${dimensions}.${format}`
}

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// Functions below used mostly for for fetching articles from Sanity.io

// data with identifications to connect with Sanity.io
let PROJECT_ID = 'x18ixioq'
let DATASET = 'production'
let folderName = 'ydkjy-get-started'

// Taking data from Sanity.io where article is equal to one that has folder named "ydkjy-get-started"
let QUERY = encodeURIComponent(
  `*[_type == "post" && folder == "${folderName}"]`,
)

// That wariable helps to fetch certain dana from Sanity.io
let PROJECT_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

// This function goes through each child in the children array and checks if it has the mark 'strong'. If it does, it wraps the text in a <strong> HTML tag. If not, it just takes the text as it is. Finally, it joins all these individual texts into a single string and returns it.
function formatTextFromChildren(children) {
  return children
    .map((child) => {
      if (child.marks.includes('strong')) {
        return `<strong>${child.text}</strong>`
      }
      return child.text
    })
    .join('')
}

// a function that takes a text and a tag, and returns the text wrapped with the given HTML tag. This is a simple helper function to keep the code DRY (Don't Repeat Yourself):
function wrapTextWithTag(text, tag) {
  return `<${tag}>${text}</${tag}>`
}

// mapping between the block styles and corresponding HTML tags. This will allow us to dynamically select the correct HTML tag based on the block's style:    //
const blockStyleToHtmlTag = {
  h2: 'h2',
  h4: 'h4',
  normal: 'p',
}

export {
  fetchData,
  sanityImageUrl,
  formatTextFromChildren,
  wrapTextWithTag,
  blockStyleToHtmlTag,
  PROJECT_ID,
  DATASET,
  folderName,
  PROJECT_URL,
}
