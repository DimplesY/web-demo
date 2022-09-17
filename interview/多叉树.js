let data = [
  {
    id: 1,
    name: '湖南',
    children: {
      id: 2,
      name: '杭州',
      children: [
        {
          id: 3,
          name: '临平',
        },
        {
          id: 4,
          name: '北京',
        },
      ],
    },
  },
  {
    id: 5,
    name: '上海',
    children: {
      id: 6,
      name: '西藏',
      children: [
        {
          id: 7,
          name: '青海',
        },
        {
          id: 8,
          name: '澳门',
        },
      ],
    },
  },
]

function findName(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (item.id === id) {
      return item.name
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      const name = findName(item.children, id)
      if (name) {
        return name
      }
    }
    if (Object.prototype.toString.call(item.children) === '[object Object]') {
      const name = findName([item.children], id)
      if (name) {
        return name
      }
    }
  }
}

console.log(findName(data, 8))
