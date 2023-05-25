import { Subject } from "rxjs";


type eventType<T = any> = { event: string, data: T }


class Bus {
  subject: Subject<eventType>

  constructor() {
    this.subject = new Subject()
  }

  on<T>(event: string, callback: (data: eventType<T>) => void) {
    this.subject.subscribe((data: eventType<T>) => {
      if (data.event === event) {
        callback(data)
      }
    })
  }

  once<T>(event: string, callback: (data: eventType<T>) => void) {
    this.subject.subscribe((data: eventType<T>) => {
      if (data.event === event) {
        callback(data)
      }
    }).unsubscribe()
  }

  emit<T = any>(event: string, data: T) {
    this.subject.next({ event, data })
  }

  off() {
    this.subject.unsubscribe()
  }

}


export default new Bus()
