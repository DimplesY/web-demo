interface Dog {
  kind: 'dog'
  bark(): void
}

interface Cat {
  kind: 'cat'
  meow(): void
}

type Animal = Dog | Cat

function Test(animal: Animal) {
  if (animal.kind === 'dog') {
    animal.bark()
  } else {
    animal.meow()
  }
}

let tom: Cat = {
  kind: 'cat',
  meow() {
    console.log('meow')
  },
}

Test(tom)

