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

export { fetchData, sanityImageUrl }
