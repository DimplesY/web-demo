class OrderManager {
  constructor() {
    this.orders = [];
  }

  execute(command, ...args) {
    return command.execute(this.orders, ...args);
  }
}

class Command {
  constructor(execute) {
    this.execute = execute;
  }
}

function PlaceOrderCommand(order, id) {
  return new Command((orders) => {
    orders.push(id);
    console.log("订单创建成功, --->" + order.name + "id --->" + id);
  });
}

function CancelOrderCommand(id) {
  return new Command((orders) => {
    let index = orders.findIndex((i) => i === id);
    orders.splice(index, 1);
    console.log("订单取消成功 --->" + id + "，订单长度" + orders.length);
  });
}

const manager = new OrderManager();

manager.execute(new PlaceOrderCommand({ name: "测试" }, 10));
manager.execute(new CancelOrderCommand(10));
