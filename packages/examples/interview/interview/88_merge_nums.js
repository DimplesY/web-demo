/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
  fn2(nums1, m, nums2, n)
};


const fn1 = (nums1, m, nums2, n) => {
  for(let i = 0; i < n; i++) {
    nums1[m + i] = nums2[i]
  }
  nums1.sort((a, b) => a - b)
}


const fn2 = (nums1, m, nums2, n) => {
  let p1 = 0, p2 = 0;
  const sorted = Array.from({length: m + n}).fill(0);
  let cur

  while(p1 < m || p2 < n) {
    if(p1 === m){
      cur = nums2[p2++]
    }else if(p2 === n) {
      cur = nums1[p1++]
    } else if(nums1[p1] < nums2[p2]) {
      cur = nums1[p1++]
    } else {
      cur = nums2[p2++]
    }

    sorted[p1 + p2 - 1] = cur
  }


  for(let i = 0; i < sorted.length; i++) {
    nums1[i] = sorted[i]
  }
}

const nums1 = [1,2,3,0,0,0]
const m = 3
const nums2 = [2,5,6]
const n = 3

merge(nums1, m, nums2, n)

console.log(nums1)
