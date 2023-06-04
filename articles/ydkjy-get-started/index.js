// Imported functions
import {
  fetchData,
  formatTextFromChildren,
  wrapTextWithTag,
  blockStyleToHtmlTag,
  PROJECT_URL,
} from '../../functions.js'

// Fetching actual data from Sanity.io
fetchData(PROJECT_URL)
  .then((data) => {
    const body = data.result[0].body
    console.log(body)

    // In this function, for each block in the body, we first format the text from the children array. Then we check if the block type is 'block' and if its style corresponds to a known HTML tag. If these conditions are met, and if it's a list item with 'normal' style, we wrap the text content with the <li> tag. If it's not a list item, we wrap the text content with the HTML tag that corresponds to the block's style. If the block type is not 'block', or if its style doesn't correspond to a known HTML tag, we simply return an empty string. Finally, we join all the formatted block strings into a single HTML string and return it.
    function formatBody(body) {
      return body
        .map((block) => {
          let textContent = formatTextFromChildren(block.children)

          if (block._type === 'block' && blockStyleToHtmlTag[block.style]) {
            if (block.listItem === 'number' && block.style === 'normal') {
              return wrapTextWithTag(textContent, 'li')
            }
            return wrapTextWithTag(
              textContent,
              blockStyleToHtmlTag[block.style],
            )
          }

          return ''
        })
        .join('')
    }

    let formattedText = formatBody(body) // assuming `body` is your data
    document.querySelector('.article-content').innerHTML = formattedText
  })
  .catch((error) => console.error('Error:', error))
