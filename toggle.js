const toggleButton = document.querySelector('.light-toggle')

toggleButton.addEventListener('click', function () {
  if (document.body.classList.contains('dark-theme')) {
    switchToLightTheme()
  } else if (document.body.classList.contains('light-theme')) {
    switchToDarkTheme()
  } else {
    switchToLightTheme()
  }
})

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
