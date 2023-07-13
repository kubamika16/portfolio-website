const dateFormatter = function (date) {
  const [, month, day, year] = new Date(date).toDateString().split(' ')
  const dateString = `${month} ${day}, ${year}`
  return dateString
}

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

// This function goes through each child in the children array and checks if it has the mark 'strong'. If it does, it wraps the text in a <strong> HTML tag. If not, it just takes the text as it is. Finally, it joins all these individual texts into a single string and returns it.
function formatTextFromChildren(children) {
  if (!children) return ''
  return children
    .map((child) => {
      if (child.marks.includes('strong')) {
        return `<strong>${child.text}</strong>`
      }
      if (child.marks.includes('code')) {
        return `<pre><code class="language-js">${child.text}</code></pre>`
      }
      return child.text
    })
    .join('')
}

function formatSanityBody(body) {
  if (!body) return ''
  return body
    .map((block) => {
      if (block._type === 'block') {
        let textContent = formatTextFromChildren(block.children)

        if (blockStyleToHtmlTag[block.style]) {
          if (block.listItem === 'bullet' && block.style === 'normal') {
            return wrapTextWithTag(textContent, 'li')
          }
          return wrapTextWithTag(textContent, blockStyleToHtmlTag[block.style])
        }
      } else if (block._type === 'code') {
        // console.log(body)
        return `<pre><code>${block.code}</code></pre>`
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
  dateFormatter,
}
