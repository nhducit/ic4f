(function () {
  angular.module('myApp', ['afkl.lazyImage'])
    .controller('main', mainController)
    .directive('hdOnerror', hdOnerror);

  function hdOnerror($parse) {
    return {
      restrict: 'A',
      link: function ($scope, $elem, $attr) {
        var elem = angular.element($elem);
        elem.bind('error', function () {
          var func = $parse($attr.hdOnerror)($scope);
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


  mainController.$inject = ['$http', '$scope'];
  function mainController($http, $scope) {
    /*
     * https://vozforums.com/showthread.php?t=4590241
     * https://vozforums.com/showthread.php?t=4270819
     * https://vozforums.com/showthread.php?t=4302565
     * https://vozforums.com/showthread.php?t=3182265
     * https://vozforums.com/showthread.php?t=2065093
     * */

    $scope.url = 'https://vozforums.com/showthread.php?t=4270819';
    $scope.images = [];
    $scope.imagesMap = {};
    $scope.maxPage = 10;
    $scope.config = {
      maxPage: 1,
      firstPage: 1
    };
    //last object is fake object for work around.
    $scope.counter = {};
    $scope.counter.brokenImage = 0;
    $scope.counter.displayedImages = 0;
    $scope.brokenImageHandler = function () {
      $scope.counter.brokenImage++;
    };
    $scope.onImageLoaded = function () {
      $scope.counter.displayedImages++;
    };
    $scope.getImages = function () {
      $scope.images = [];
      $scope.imagesMap = {};
      $scope.counter.brokenImage = 0;
      $scope.counter.displayedImages = 0;
      oboe({
        url: 'getImages',
        method: 'post',
        body: {
          url: $scope.url,
          config: $scope.config
        }
      })
        .node('data.*', function (image) {
          if (!$scope.imagesMap[image.url]) {
            $scope.imagesMap[image.url] = true;
            $scope.$evalAsync(function () {
              $scope.images.push(image);
            });
          }
        });

//        $http.post('/getImages', {url: $scope.url, config: $scope.config}).then(function (successData) {
//          $scope.images = successData.data.data;
//        }, function () {
//          ;
//        });
    };
    $scope.getImages();
  }
})();