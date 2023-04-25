const codeBlocker = () => {
  // return new Promise((resolve, reject) => {
  //   let i = 0
  //   while (i < 1000000000) i++
  //   resolve('Billion loops done')
  // })

  return Promise.resolve().then((v) => {
    let i = 0
    while (i < 1000000000) i++
    return 'Billion loops done'
  })
}

console.log('Synchronous 1')

console.log(codeBlocker().then())

console.log('Synchronous 2')

const hello = async function () {
  console.log('hello world')
}

hello()
