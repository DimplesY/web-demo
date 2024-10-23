/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {

  let len  = nums.length;
  let slow = 1, fast = 1;

  while(fast < len) {
    if(nums[fast] !== nums[fast - 1]) {
      nums[slow] = nums[fast]
      slow++
    }
    fast++
  }

  return slow

};



console.log(
  removeDuplicates([1,1, 2])
)
