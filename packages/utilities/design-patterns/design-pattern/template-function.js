const Beverage = function(){}

Beverage.prototype.boilWater = function() {
  console.log('把水煮沸')
}

// 抽象方法，由子类去具体实现
Beverage.prototype.brew = function() {};
// 抽象方法，由子类去具体实现
Beverage.prototype.pourInCur = function(){};
// 抽象方法，由子类去具体实现
Beverage.prototype.addCondiments = function(){};
Beverage.prototype.init = function() {
  this.boilWater();
  this.brew();
  this.pourInCur();
  this.addCondiments();
}

const Coffee = function() {};
Coffee.prototype = new Beverage();

Coffee.prototype.brew = function() {
  console.log('用沸水冲泡咖啡')
}

Coffee.prototype.pourInCur = function() {
  console.log('把咖啡倒进杯子')
}

Coffee.prototype.addCondiments = function() {
  console.log('加糖和牛奶')
}

const coffee = new Coffee();
coffee.init();


const Tea = function() {};
Tea.prototype = new Beverage();

Tea.prototype.brew = function() {
  console.log('用沸水冲泡茶叶')
}

Tea.prototype.pourInCur = function() {
  console.log('把茶叶倒进杯子')
}

Tea.prototype.addCondiments = function() {
  console.log('加柠檬')
}

const tea = new Tea();
tea.init();
