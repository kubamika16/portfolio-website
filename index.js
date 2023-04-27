const getFruit = async (name) => {
  const fruits = {
    pinaple: '🍍',
    peach: '🍑',
    strawbery: '🍓',
  }
  return fruits[name]
}

getFruit('peach').then(console.log)
