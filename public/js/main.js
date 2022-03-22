// const { db } = require('../../DB')

console.log('work')

const $signUpForm = document.forms.signUpForm
if ($signUpForm) {
  const $nameInput = $signUpForm.elements.name
  const $emailInput = $signUpForm.elements.email
  const LSKey = 'signUpForm'

  $nameInput.addEventListener('input', (e) => {
    const oldData = JSON.parse(window.localStorage.getItem(LSKey))
    const dataforSave = {
      ...oldData,
      [e.target.name]: e.target.value,
    }
    window.localStorage.setItem(LSKey, JSON.stringify(dataforSave))
  })

  $emailInput.addEventListener('input', (e) => {
    console.log(e.target)
    const oldData = JSON.parse(window.localStorage.getItem(LSKey))
    console.log({ oldData })
    const dataforSave = {
      ...oldData,
      [e.target.name]: e.target.value,
    }
    window.localStorage.setItem(LSKey, JSON.stringify(dataforSave))
  })
  const datafromLS = JSON.parse(window.localStorage.getItem(LSKey))
  if (datafromLS) {
    $nameInput.value = datafromLS.name
    $emailInput.value = datafromLS.email
  }
}


const $deleteBtn = document.querySelector('[data-btn]')
console.log($imgCard)
console.log($deleteBtn)


if ($deleteBtn) {
  $deleteBtn.addEventListener('click', () => {
    fetch('/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: }), //в разработке
    })
  })
}
