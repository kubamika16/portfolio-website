document.getElementById('closeButton').addEventListener('click', function () {
  document.querySelector('.overlay').style.display = 'none'
  localStorage.setItem('overlayHiddenAt', Date.now())
})

// Check if the overlay should be displayed
const overlayHiddenAt = localStorage.getItem('overlayHiddenAt')
const timeElapsed = Date.now() - (overlayHiddenAt || 0)

const fiveMinutesInMilliseconds = 5 * 60 * 10000

if (timeElapsed < fiveMinutesInMilliseconds) {
  document.querySelector('.overlay').style.display = 'none'
} else {
  document.querySelector('.overlay').style.display = 'flex'
}
