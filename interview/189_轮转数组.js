
var rotate = function(nums, k) {
  for(let i = 0; i < k; i++) {
    nums.unshift(nums.pop())
  }
};


rotate([1,2,3,4,5,6,7], 3)
