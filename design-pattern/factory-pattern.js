/**
 * 工厂模式中，我们在创建对象时不会对客户端暴露创建逻辑，并且是通过使用一个共同的接口来指向新创建的对象，用工厂方法代替new操作的一种模式。
 */
class Creater {
  create(name) {
    return new Animal(name);
  }
}

class Animal {
  constructor(name) {
    this.name = name;
  }
}

let creator = new Creater();

let cat = creator.create("cat");
console.log(cat.name);

let dog = creator.create("dog");
console.log(dog.name);
