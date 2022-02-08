/**
 * 单例设计模式
 */

class Person {
  constructor(name) {
    this.name = name;
  }
}

let obj = null;

function singletonPerson() {
  if (!obj) {
    obj = new Person("小明");
    console.log("我被调用了");
  }
  return obj;
}

console.log(singletonPerson().name);
console.log(singletonPerson().name);
console.log(singletonPerson().name);
