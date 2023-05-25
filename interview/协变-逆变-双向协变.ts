interface Duck {
  name: string
  walk: () => void
  call: () => void
}

interface Bird {
  name: string
  walk: () => void
}

const duck: Duck = {
  name: '小黄',
  walk: () => console.log('小黄走路'),
  call: () => console.log('小黄叫'),
}

let bird: Bird = {
  name: '小绿',
  walk: () => console.log('小绿走路'),
}

bird = duck // 协变
console.log(bird)

let getDuck = (params: Duck) => {
  console.log(params)
}

const getBird = (params: Bird) => {
  console.log(params)
}

getDuck = getBird // 逆变
console.log(getDuck)

//   "strictFunctionTypes": false
// getBird = getDuck // 双向协变
