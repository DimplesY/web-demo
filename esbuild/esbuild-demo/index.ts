(function () {
  const app = document.querySelector('#app');
  const div = document.createElement('div');
  div.innerHTML = '<div>Hello World</div>';
  app?.appendChild(div);
})();
