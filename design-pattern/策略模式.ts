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

function exeStrategyActions(actions: Strategy[]) {
  actions.some((item) => {
    const [flag, action] = item
    if (flag) {
      action()
    }
    return flag
  })
}

exeStrategyActions(strategy)
