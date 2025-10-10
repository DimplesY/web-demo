interface IRecvice {
  value: number,
  money: number
}

function getRecvice(arr:IRecvice[]) {

    const bitArr = [1,5,10,20,50,100]

    const res = arr.reduce((pre, cur) => pre + cur.money - cur.value, 0)

    const sets = new Set<number>()
    function dfs(sum:number, nodes: number[]){
      if(sum === res) {
        return true
      }

      if(sum > res || nodes.length === 0) {
        sets.clear()
        return false
      }

      for(let i =0; i< nodes.length ; i++){
        const current = nodes[i]
        const newSum = sum + current
        sets.add(current)
        const newNodes = nodes.filter(i => !sets.has(i))
        if(dfs(newSum, newNodes)) {
          return true
        }
      }
      return false
    }

    return dfs(0, bitArr)
}

const result = getRecvice([
  {
    value: 10,
    money: 50
  },
  {
    value: 10,
    money: 100
  }
])

console.log(result)
