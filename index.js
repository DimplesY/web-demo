
/**
 * 
 * @param {Date} date1 
 * @param {Date} date2 
 */
function differDate(date1, date2) {

  const durationList = [1000 * 60 * 60 * 24 * 365, 1000 * 60 * 60 * 24, 1000 * 60 * 60, 1000 * 60, 1000 ]
  const unitList = ['年', '日', '小时', '分钟', '秒']

  let distance = date2 - date1
  let result = ''
  let i = 0
  while(distance > 0 && i < durationList.length) {
    const temp =  Math.floor(distance / durationList[i])
    if(temp > 0){
      result +=  `${temp}${unitList[i]}`
      distance = distance - temp * durationList[i]
    }
    i++
  }

  return result
}


console.log(differDate(new Date('2023-11-21 20:45:00'), new Date()))
