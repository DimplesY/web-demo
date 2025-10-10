

class Editor {
  constructor(public content: string) {
  }

  type(words: string) {
    this.content += words
  }

  save() {
    return new EditorMemento(this.content);
  }

  restore(memento: EditorMemento) {
    this.content = memento.getContent()
  }
}


class EditorMemento {
  constructor(private content: string) {
  }

  getContent() {
    return this.content
  }
}


class EditorCaretaker {
  constructor(private memento: EditorMemento[] = []) {
  }

  push(state: EditorMemento) {
    this.memento.push(state)
  }

  pop() {
    return this.memento.pop()
  }
}


const editor = new Editor('')
const caretaker = new EditorCaretaker()

editor.type('hello')
caretaker.push(editor.save())

console.log(editor.content)

editor.type('world')
console.log(editor.content)

editor.restore(caretaker.pop()!)
console.log(editor.content)
