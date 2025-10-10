var plusOne = (nums) => {
  const n = nums.length

  for(let i = n - 1; i >= 0; --i) {
    if(nums[i] !== 9) {
      nums[i]++
      for(let j = i + 1; j < n;++j) {
        nums[j] = 0
      }
      return nums
    }
  }

  const arr = new Array(n + 1).fill(0)
  arr[0] = 1
  return arr
}

console.log(plusOne([9,9,9]))


