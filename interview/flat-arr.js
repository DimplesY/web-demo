function flat(arr) {
  let result = []
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flat(arr[i]))
    } else {
      result.push(arr[i])
    }
  }
  return result
}


function flatten(arr) {
  let result = []
  ;(function flat(arr) {
    arr.forEach((item) => {
      if (Array.isArray(item)) flat(item)
      else result.push(item)
    })
  })(arr)

  return result
}
console.log(flatten([1, 2, 3, [1]]))
