

function romanToInt(s) {
  const map = new Map([
    ['I', 1],
    ['V', 5],
    ['X', 10],
    ['L', 50],
    ['C', 100],
    ['D', 500],
    ['M', 1000],
  ])
  let sum = 0
  let preNum = map.get(s[0])
  for(let i = 1; i < s.length; i++) {
    let num = map.get(s[i])
    if(preNum < num) {
      sum -= preNum
    } else {
      sum += preNum
    }
    preNum = num  
  }

  sum += preNum
  return sum
}


console.log(romanToInt('IV'))
