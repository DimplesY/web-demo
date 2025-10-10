interface Agent {
  calc(num1: number, num2: number)
}

class NPC1 implements Agent {
  calc(num1: number, num2: number) {
    return num1 + num2
  }
}

class NPC2 implements Agent {
  calc(num1: number, num2: number) {
    return num1 - num2
  }
}

class Person {
  agent: Agent

  calc(num1: number, num2: number) {
    return this.agent.calc(num1, num2)
  }
}

let peron = new Person()
peron.agent = new NPC1()
console.log(peron.calc(1, 2))
