class Class {
  initMap() {
    console.log('initMap')
  }
}

const mixin1 = (Base) => class extends Base {
 
  setOptions(){
    console.log('setOptions')
  }
}

const mixin2 = (Base) => class extends Base {

  setOptions(){
    console.log('setOptions2')
  }
}


class Test extends mixin2(mixin1(Class)) {
}
