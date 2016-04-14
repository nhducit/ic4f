(function () {
  // angular.module('myApp', ['afkl.lazyImage'])
  angular.module('myApp', [])
    .controller('main', mainController);


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
    $scope.state = {};
    $scope.state.isLoading = false;
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
    var oboeObj = {};

    $scope.cancelRequest = function () {
      $scope.state.isLoading = false;
      oboeObj && oboeObj.abort && oboeObj.abort();
    };

    $scope.getImages = function () {
      oboeObj && oboeObj.abort && oboeObj.abort();
      $scope.images = [];
      $scope.imagesMap = {};
      $scope.counter.brokenImage = 0;
      $scope.counter.displayedImages = 0;
      $scope.state.isLoading = true;
      oboeObj = oboe({
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
        })
        .done(function () {
          $scope.state.isLoading = false;
        })
        .fail( function( errorReport ){
          $scope.state.isLoading = false;
          console.log('Error when loading data', errorReport)
        });


//        $http.post('/getImages', {url: $scope.url, config: $scope.config}).then(function (successData) {
//          $scope.images = successData.data.data;
//        }, function () {
//          ;
//        });
    };
    // $scope.getImages();
  }
})();