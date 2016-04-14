/**
 * Created by duc on 15/04/2016.
 */


(function () {
  angular.module('myApp')
    .directive('hdOnError', hdOnError);

  function hdOnError($parse) {
    return {
      restrict: 'A',
      link: function ($scope, $elem, $attr) {
        var elem = angular.element($elem);
        elem.bind('error', function () {
          var func = $parse($attr.hdOnError)($scope);
          $scope.$evalAsync(function () {
            func();
          })
        });

        elem.bind('load', function () {
          var func = $parse($attr.hdOnload)($scope);
          $scope.$evalAsync(function () {
            func();
          })
        });
      }
    };
  }
})();