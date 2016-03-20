/**
 * Created by duc on 20/03/2016.
 */

(function () {
  angular.module('myApp')
    .controller('main', mainController);

  mainController.$inject = ['$http'];
  function mainController($http) {
    console.log('started');

  }
})();