const CalcMixin = (Base) =>
  class extends Base {
    calc() {
      console.log("混入 clac");
    }
  };

class Parent {}

class MyClass extends CalcMixin(Parent) {}

const m = new MyClass();

m.calc();
