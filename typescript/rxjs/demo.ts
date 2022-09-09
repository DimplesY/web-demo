const getConfigName = (name: string): PropertyDecorator => {
  return (target: any, propertyKey: string | symbol) => {
    console.log(target)
  }
}

class ConfigMan {
  constructor(private _name: string, private _age: number) {}

  set name(name: string) {
    this._name = name
  }

  set age(age: number) {
    this._age = age
  }

  @getConfigName("name")
  get name() {
    return this._name
  }

  get age() {
    return this._age
  }
}

const person = new ConfigMan('John', 30)
person.age = 10
person.name = 'XiaoMan'
