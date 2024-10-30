
abstract class Animal {
  constructor(protected readonly name: string) {}
}

class Dog extends Animal {

  constructor(name: string) {
    super(name)
  }

  bark() {
    console.log(`${this.name} bark`)
  }
}

class Cat extends Animal {

  constructor(name: string) {
    super(name)
  }

  meow() {
    console.log(`${this.name} meow`)
  }
}

class AnimalFactory {
  public create<T extends 'dog' | 'cat'>(type: T, name: string): T extends 'dog' ? Dog : Cat {
    return (type === 'cat' ? new Cat(name) : new Dog(name)) as T extends 'dog' ? Dog : Cat
  }
}


const factory = new AnimalFactory()

const dog = factory.create('dog', '旺财')
const cat = factory.create('cat', '小猫')

console.log(dog.bark())
console.log(cat.meow())
