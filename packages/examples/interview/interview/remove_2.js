
var remove = (nums, target) => {
  let s = 0;
  for(let i = nums.length - 1; i >= 0; --i) {
    if(nums[i] !== target) {
      nums[s] = nums[i]
      s++
    }
  }

  return [nums, s - 1]
}


console.log(remove([3,1, 3, 2], 3))
