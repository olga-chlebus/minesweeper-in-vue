
require(['js/gameboard'], function(gameboard){
  new Vue({
    el: '#board',
    components: {
      gameboard: gameboard
    },
    template: '<gameboard></gameboard>'
  });
});
