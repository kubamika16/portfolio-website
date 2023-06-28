const toggleButton = document.querySelector('.light-toggle')

toggleButton.addEventListener('click', function () {
  // Setting up the date to current. From now on, for next couple minutes one of the themes will be on
  let now = new Date()

  if (document.body.classList.contains('dark-theme')) {
    // Because we want to change to ligh theme, we have to save that theme in local storage
    localStorage.setItem('theme', 'light')
    localStorage.setItem('themeTime', now.getTime())
    switchToLightTheme()
  } else if (document.body.classList.contains('light-theme')) {
    localStorage.setItem('theme', 'dark')
    localStorage.setItem('themeTime', now.getTime())
    switchToDarkTheme()
  } else {
    // This is when there is no class (dark or light theme)
    localStorage.setItem('theme', 'light')
    localStorage.setItem('themeTime', now.getTime())
    switchToLightTheme()
  }
})

// The function to check the saved theme and its timestamp
function applySavedTheme() {
  let savedTheme = localStorage.getItem('theme')
  let savedThemeTime = localStorage.getItem('themeTime')

  if (savedTheme && savedThemeTime) {
    let now = new Date()
    let elapsedMinutes = Math.round(
      (now.getTime() - savedThemeTime) / 1000 / 60,
    )

    // If not more than 10 minutes have passed since the theme was set
    if (elapsedMinutes <= 10) {
      if (savedTheme === 'light') {
        switchToLightTheme()
      } else {
        switchToDarkTheme()
      }
    } else {
      // If more than 10 minutes have passed, remove the saved theme
      localStorage.removeItem('theme')
      localStorage.removeItem('themeTime')
    }
  }
}

// Call the function when the page loads
applySavedTheme()

function switchToLightTheme() {
  document.body.classList.remove('dark-theme')
  document.body.classList.add('light-theme')
  document.body.style.setProperty(
    '--background-color',
    'var(--background-color-light)',
  )
  document.body.style.setProperty('--font-color', 'var(--font-color-light)')
  document.body.style.setProperty(
    '--code-background-color',
    'var(--code-background-color-light)',
  )
  document.body.style.setProperty('--code-color', 'var(--code-color-light)')
  document.body.style.setProperty('--border-color', 'var(--border-color-light)')
  document.body.style.setProperty(
    '--background-slightly-grey',
    'var(--background-slightly-grey-light)',
  )
}

function switchToDarkTheme() {
  document.body.classList.remove('light-theme')
  document.body.classList.add('dark-theme')
  document.body.style.setProperty(
    '--background-color',
    'var(--background-color-dark)',
  )
  document.body.style.setProperty('--font-color', 'var(--font-color-dark)')
  document.body.style.setProperty(
    '--code-background-color',
    'var(--code-background-color-dark)',
  )
  document.body.style.setProperty('--code-color', 'var(--code-color-dark)')
  document.body.style.setProperty('--border-color', 'var(--border-color-dark)')
  document.body.style.setProperty(
    '--background-slightly-grey',
    'var(--background-slightly-grey-dark)',
  )
}
