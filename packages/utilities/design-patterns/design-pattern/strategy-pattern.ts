
type Strategy = [boolean, () => void]


const strategy: Strategy[] = [
  [
    false,
    () => {
      console.log('我是策略1')
    }
  ],
  [
    true,
    () => {
      console.log('我是策略2')
    }
  ]
]


function executeStrategyActions(actions: Strategy[]) {
  actions.some((item) => {
    const [flag, action] = item
    if (flag) {
      action()
    }
    return flag
  })
}


executeStrategyActions(strategy)
