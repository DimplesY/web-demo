function flat(arr, depth = 1) {
  let result = []
  let curDepth = 1
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i]) && curDepth <= depth) {
      result = result.concat(flat(arr[i]))
    } else {
      result.push(arr[i])
    }
  }
  return result
}

// function flatten(arr) {
//   let result = []
//   ;(function flat(arr) {
//     arr.forEach((item) => {
//       if (Array.isArray(item)) flat(item)
//       else result.push(item)
//     })
//   })(arr)

//   return result
// }

function flatten(list, depth = 1) {
  if (depth === 0) return list
  return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b, depth - 1) : b), [])
}

function flatten(list, depth = 1) {
  return depth === 0 ? list : list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b, depth - 1) : b), [])
}

console.log(flatten([1, 2, 3, [1, [2]]], 1))
