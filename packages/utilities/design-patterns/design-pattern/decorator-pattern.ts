// 装饰器模式
{
  abstract class Person {
    abstract wear(): void
  }


  class Boy extends Person {
    wear(): void {
      console.log('穿衣服')
    }
  }

  abstract class Decorator extends Person {
    constructor(protected person: Person) {
      super()
    }
    wear(): void {
      this.person.wear()
    }
  }

  class Decorator1 extends Decorator {
    constructor(person: Person) {
      super(person)
    }
    wear(): void {
      this.person.wear()
      console.log('穿裤子')
    }
  }

  class Decorator2 extends Decorator {
    constructor(person: Person) {
      super(person)
    }
    wear(): void {
      this.person.wear()
      console.log('穿袜子')
      console.log('穿鞋子')
    }
  }

  const boy = new Boy()
  const decorator1 = new Decorator1(boy)
  const decorator2 = new Decorator2(decorator1)
  decorator2.wear()

}
