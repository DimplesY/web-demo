

function quickSort(arr) {
  if (arr.length <= 1) return arr
  const pivotIndex = Math.floor(arr.length / 2)
  const pivot = arr.splice(pivotIndex, 1)[0]

  const left = []
  const right = []

  for(let i = 0 ; i < arr.length; i ++ ) {
    if(arr[i] < pivot) {
      left.push(arr[i])
    }else {
      right.push(arr[i])
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)]
}


console.log(quickSort([2,23,4,5,6,1,2,3,45,56,4]))
