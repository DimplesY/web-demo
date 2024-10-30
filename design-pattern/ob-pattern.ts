/**
 * 观察者模式基于发布订阅模式实现，观察者模式能够自动通知所有观察者对象状态的改变
 */

class Subject {
  constructor(name){
    this.name = name
    this.tracker = []
  }

  attach(observer){
    this.tracker.push(observer)
  }

  notify(){
    this.tracker.forEach(observer => observer.update())
  }
  
}

class Observer{
  constructor(name){
    this.name = name
  }

  update(){
    console.log(`${this.name} update`)
  }
}

let o1 = new Observer('o1')
let o2 = new Observer('o2')

let s1 = new Subject('s1')
s1.attach(o1)
s1.attach(o2)

s1.notify()
