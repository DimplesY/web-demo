const CalcMixin = (Base: any) =>
  class extends Base {

    calc() {
      console.log("混入 calc");
    }
  };

class Parent {}

class MyClass extends CalcMixin(Parent) {}

const m = new MyClass();

m.calc();
