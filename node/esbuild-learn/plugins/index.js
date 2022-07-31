module.exports =  {
  name: 'my-plugin',
  setup({ onStart, onResolve, onLoad, onEnd }) {
    onStart(() => {
      console.log('onStart');
    });
    onResolve({ filter: /.*/ }, (msg) => {
      console.log('onResolve', msg);
    });
    onLoad({ filter: /.*/ }, (msg) => {
      console.log('onLoad', msg);
    });
    onEnd((msg) => {
      console.log('onEnd', msg);
    });
  },
};