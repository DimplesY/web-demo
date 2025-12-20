abstract class AbstractProduct {

  abstract operation1(): string;
  abstract operation2(): string;
  public test() {
    this.operation1()
    this.operation2()
  }
}


class A extends AbstractProduct {
  operation1(): string {
    return 'A'
  }
  operation2(): string {
    return 'B'
  }
}


class B extends AbstractProduct {
  operation1(): string {
    return 'C'
  }
  operation2(): string {
    return 'D'
  }
}



const a = new A()
a.test()

const b = new B()
b.test()
