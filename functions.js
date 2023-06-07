// const dateFormatter = {
//   // The formatDate function takes a date string as input.
//   formatDate(dateString, { includeYear = false } = {}) {
//     // The Date object is created from the provided date string.
//     const date = new Date(dateString)
//     let options = { month: 'long', day: 'numeric' }

//     if (includeYear) {
//       options.year = 'numeric'
//     }

//     // The Intl.DateTimeFormat object is created with specified options.
//     // The 'en-US' locale is used, and the format is set to display the full name of the month and the numeric day.
//     // This way, the date will be formatted as per the standard in United States.
//     const formatter = new Intl.DateTimeFormat('en-US', options)
//     return formatter.format(date)
//   },
// }

const ISODateDescructureFunction = function (ISODate) {
  const [weekday, month, day, year] = new Date(ISODate)
    .toDateString()
    .split(' ')
  return { weekday, month, day, year }
}

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

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// SANITY.IO TEXT FORMAT

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

// In this function, for each block in the body, we first format the text from the children array. Then we check if the block type is 'block' and if its style corresponds to a known HTML tag. If these conditions are met, and if it's a list item with 'normal' style, we wrap the text content with the <li> tag. If it's not a list item, we wrap the text content with the HTML tag that corresponds to the block's style. If the block type is not 'block', or if its style doesn't correspond to a known HTML tag, we simply return an empty string. Finally, we join all the formatted block strings into a single HTML string and return it.
function formatSanityBody(body) {
  return body
    .map((block) => {
      let textContent = formatTextFromChildren(block.children)

      if (block._type === 'block' && blockStyleToHtmlTag[block.style]) {
        if (block.listItem === 'number' && block.style === 'normal') {
          return wrapTextWithTag(textContent, 'li')
        }
        return wrapTextWithTag(textContent, blockStyleToHtmlTag[block.style])
      }

      return ''
    })
    .join('')
}

export {
  fetchData,
  sanityImageUrl,
  formatTextFromChildren,
  wrapTextWithTag,
  blockStyleToHtmlTag,
  PROJECT_ID,
  DATASET,
  // dateFormatter,
  formatSanityBody,
  ISODateDescructureFunction,
}
