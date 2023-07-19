// 被观察者 - 主题
interface Subject {
    // 观察者列表
    observers: Observer[];
    // 注册观察者
    registerObserver(o: Observer): void;
    // 移除观察者
    removeObserver(o: Observer): void;
    // 通知观察者
    notifyObservers(): void;
}

// 观察者
interface Observer {
    // 更新 - 通知   
    update(subject: Subject): void;
}


class ProjectSubject implements Subject {
  public observers: Observer[] = []

  registerObserver(o: Observer): void {
    if(!this.observers.includes(o)){
      this.observers.push(o);
    }
  }

  removeObserver(o: Observer): void {
    this.observers.splice(this.observers.indexOf(o), 1);
  }

  notifyObservers(): void {
    this.observers.forEach(o => o.update(this));
  }
}

class ProjectObserver implements Observer {
  update(subject: Subject): void {
    console.log('ProjectObserver: ', subject)
  }

}

const projectSubject = new ProjectSubject()
const projectObserver = new ProjectObserver()
projectSubject.registerObserver(projectObserver)
projectSubject.notifyObservers()

setTimeout(() => {
  projectSubject.notifyObservers()
}, 1000);
