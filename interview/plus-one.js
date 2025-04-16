var plusOne = function(digits) {
  const n = digits.length

  for(let i = n - 1; i >= 0; --i) {
      if(digits[i] !== 9){
          ++digits[i]
          // 前一位进1后面的位都置0
          for(let j = i + 1; j < n; ++j) {
              digits[j] = 0
          }

          return digits
      }
  }

  const ans = new Array(n + 1).fill(0);
  ans[0] = 1;
  return ans;

};


console.log(plusOne([1, 9]))
